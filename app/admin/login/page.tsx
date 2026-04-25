import type { Metadata } from "next";
import LoginForm from "@/app/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return <LoginForm next={next} initialError={error} />;
}
