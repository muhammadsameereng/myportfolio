"use server";

import { createClient } from "@/app/lib/supabase/server";
import { isAdminEmail } from "@/app/lib/admin/auth";
import type { BlogJobRow } from "@/app/lib/supabase/types";

const DEPTHS = ["short", "standard", "deep"] as const;
type Depth = (typeof DEPTHS)[number];

// Columns the UI needs — avoid shipping the big text blobs (draft_md etc)
// to the client on every poll.
const LIST_COLS =
  "id,topic,angle,depth,status,stage,post_id,error,attempts,created_at,updated_at";

export type BlogJobSummary = Pick<
  BlogJobRow,
  | "id"
  | "topic"
  | "angle"
  | "depth"
  | "status"
  | "stage"
  | "post_id"
  | "error"
  | "attempts"
  | "created_at"
  | "updated_at"
>;

/** Server client + admin allow-list check. Returns null client if blocked. */
async function adminClient() {
  const supabase = await createClient();
  if (!supabase) return { supabase: null, error: "Supabase not configured." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return { supabase: null, error: "Not authorised." };
  }
  return { supabase, error: null as string | null };
}

export async function createBlogJob(input: {
  topic: string;
  angle?: string;
  depth?: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };

  const topic = input.topic?.trim();
  if (!topic) return { ok: false, error: "Topic is required." };
  const depth: Depth = DEPTHS.includes(input.depth as Depth)
    ? (input.depth as Depth)
    : "standard";

  const { data, error: insErr } = await supabase
    .from("blog_jobs")
    .insert({ topic, angle: input.angle?.trim() || "", depth, status: "pending", stage: "research" })
    .select("id")
    .single();

  if (insErr) return { ok: false, error: insErr.message };
  return { ok: true, id: data.id as string };
}

export async function getRecentJobs(limit = 12): Promise<BlogJobSummary[]> {
  const { supabase } = await adminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("blog_jobs")
    .select(LIST_COLS)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as BlogJobSummary[]) || [];
}

export async function resumeJob(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const { supabase, error } = await adminClient();
  if (!supabase) return { ok: false, error: error! };
  // Keep `stage` so it resumes from where it failed; reset the retry/lock state.
  const { error: updErr } = await supabase
    .from("blog_jobs")
    .update({ status: "pending", locked_at: null, attempts: 0, error: null })
    .eq("id", id);
  if (updErr) return { ok: false, error: updErr.message };
  return { ok: true };
}
