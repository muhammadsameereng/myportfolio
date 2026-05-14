"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import BackgroundDecor from "./BackgroundDecor";
import Footer from "./Footer";
import Navbar from "./Navbar";
import ScrollToTopLazy from "./ScrollToTopLazy";

const ChatLauncher = dynamic(() => import("./agent/ChatLauncher"), {
  ssr: false,
});

/**
 * Renders the public site's chrome (Navbar, Footer, ScrollToTop) only on
 * non-admin routes. Admin pages have their own shell, so we hide all of
 * this on `/admin/*`.
 */
export default function PublicChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin uses its own AdminShell; render children flush.
    return <>{children}</>;
  }

  return (
    <>
      <BackgroundDecor />
      <Navbar />
      {children}
      <Footer />
      <ScrollToTopLazy />
      <ChatLauncher />
    </>
  );
}
