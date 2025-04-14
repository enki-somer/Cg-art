"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the cursor client component with no SSR
const CursorClient = dynamic(() => import("./cursor-client"), {
  ssr: false,
  loading: () => null,
});

export function CursorWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only load the cursor after a delay to prioritize content
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return <CursorClient />;
}
