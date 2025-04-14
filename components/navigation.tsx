"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const routes = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin", adminOnly: true },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md"
    >
      <div className="container flex h-20 items-center justify-between px-4">
        <Link href="/" className="relative text-2xl font-bold">
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Enki
          </span>
          <motion.div
            className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-blue-500"
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </Link>
        <nav className="hidden md:flex md:gap-8">
          {routes
            .filter((route) => !route.adminOnly || pathname === "/admin")
            .map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group relative text-sm font-medium transition-colors",
                  pathname === route.href
                    ? "text-primary"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {route.label}
                <motion.div
                  className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-blue-500"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
        </nav>
        <button
          className="relative z-50 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </button>
      </div>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -20,
          display: isOpen ? "block" : "none",
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 w-full border-t border-white/10 bg-black/95 px-4 py-6 backdrop-blur-md md:hidden"
      >
        <div className="container flex flex-col gap-4">
          {routes
            .filter((route) => !route.adminOnly || pathname === "/admin")
            .map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors",
                  pathname === route.href
                    ? "text-primary"
                    : "text-gray-300 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.label}
                {pathname === route.href && (
                  <motion.div
                    className="ml-2 h-1 w-1 rounded-full bg-primary"
                    layoutId="nav-dot"
                  />
                )}
              </Link>
            ))}
        </div>
      </motion.nav>
    </motion.header>
  );
}
