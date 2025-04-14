"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/unauthorized";

  // For auth pages, return just the content without navigation or footer
  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // For other pages, include the navigation and footer
  return (
    <>
      <Navigation />
      <div id="main-content">{children}</div>
      <Footer />
    </>
  );
}
