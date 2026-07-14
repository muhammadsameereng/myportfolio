import { createClient } from "@/app/lib/supabase/server";
import { isAdminEmail } from "@/app/lib/admin/auth";
import { getClientIp, slidingWindowLimiter } from "@/app/lib/agent/rate-limit";
import { processJob } from "@/app/lib/pipeline/runner";

// Node runtime: the pipeline reads files, calls Gemini, renders next/og
// images, and writes Supabase — all Node-only. maxDuration gives the
// state-machine loop room to advance several stages per invocation; the
// runner self-pauses well under it and the client re-kicks to resume.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Generous enough for polling re-kicks across a few concurrent jobs.
const limit = slidingWindowLimiter({ windowMs: 60_000, maxRequests: 30 });

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!limit(getClientIp(req)).ok) {
    return json({ error: "Slow down a moment." }, 429);
  }

  // This route is /api/* — NOT covered by the /admin proxy middleware — so
  // it must self-gate: valid session AND an allow-listed admin email.
  const supabase = await createClient();
  if (!supabase) return json({ error: "Supabase not configured." }, 503);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    return json({ error: "Not authorised." }, 401);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json({ error: "GEMINI_API_KEY is not set." }, 500);

  const { id } = await ctx.params;

  try {
    const result = await processJob(supabase, apiKey, id);
    const status = result.status === "notfound" ? 404 : result.ok ? 200 : 500;
    return json(result, status);
  } catch (e) {
    // PipelineConfigError or any unexpected throw — fail loud, don't 200.
    return json(
      { ok: false, status: "error", error: e instanceof Error ? e.message : String(e) },
      500
    );
  }
}
