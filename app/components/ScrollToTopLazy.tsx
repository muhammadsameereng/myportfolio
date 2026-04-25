"use client";

import dynamic from "next/dynamic";

// Below-the-fold widget. Lazy-loaded with ssr: false so its JS (and the
// framer-motion code it pulls in) is excluded from the initial server-
// rendered HTML chunk and only fetched after first paint.
const ScrollToTop = dynamic(() => import("./ScrollToTop"), { ssr: false });

export default function ScrollToTopLazy() {
  return <ScrollToTop />;
}
