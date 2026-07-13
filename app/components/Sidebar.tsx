"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import type { NavLink } from "./homepageData";

type SidebarProps = {
  navLinks: NavLink[];
};

export default function Sidebar({ navLinks }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarItems = [
    { icon: "🏠", label: "Home", href: "/" },
    { icon: "🔍", label: "Search Engine", href: "/search" },
    { icon: "📰", label: "Chronicles", href: "/chronicles" },
    { icon: "📚", label: "Magazines", href: "/magazines" },
    { icon: "👤", label: "Builders", href: "/builders" },
    { icon: "🚀", label: "Founders", href: "/founders" },
    { icon: "🔬", label: "Research", href: "/research" },
    { icon: "💡", label: "Projects & OS", href: "/projects" },
    { icon: "💼", label: "Opportunities", href: "/opportunities" },
    { icon: "🏫", label: "College Collabs", href: "/college-collabs" },
    { icon: "🗺️", label: "Innovation Map", href: "/map" },
    { icon: "🏆", label: "Rewards & Awards", href: "/rewards" },
    { icon: "🎤", label: "Events Portal", href: "/events" },
    { icon: "🤝", label: "Collab Board", href: "/collab-board" },
    { icon: "🎓", label: "Mentorship", href: "/mentorship" },
    { icon: "📚", label: "Resource Library", href: "/resources" },
    { icon: "🧑💻", label: "Community", href: "/community" },
    { icon: "🎙️", label: "Podcast", href: "/podcast" },
    { icon: "👨💼", label: "Campus Ambassador", href: "/campus-ambassador" },
    { icon: "🏛️", label: "Advisory Board", href: "/advisory-board" },
    { icon: "📰", label: "Media Kit", href: "/media-kit" },
    { icon: "🔒", label: "Admin Panel", href: "/admin" },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 z-50 overflow-y-auto"
              style={{ backgroundColor: "#1B2A6B" }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                  <div className="font-display text-lg font-black uppercase tracking-wider" style={{ color: "#FFFFFF" }}>
                    <span style={{ color: "#D4A017" }}>A.R.K</span>
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-wider" style={{ letterSpacing: "2px", color: "#FFFFFF" }}>
                    CHRONICLES
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-full p-2 transition-all duration-150 hover:bg-white/10"
                  style={{ color: "#FFFFFF" }}
                  aria-label="Close navigation"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-150 hover:bg-white/10"
                    style={{ color: "#FFFFFF" }}
                  >
                    <span className="text-xl" style={{ color: "#FFFFFF" }}>{item.icon}</span>
                    <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-white/10">
                <div className="flex flex-col gap-3">
                  <Link
                    href="/submit-story"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-full border border-white/20 px-4 py-3 text-center text-sm font-medium transition-all duration-150 hover:border-white hover:bg-white/10"
                    style={{ color: "#FFFFFF" }}
                  >
                    Submit Story
                  </Link>
                  <Link
                    href="#"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-full border border-white/20 px-4 py-3 text-center text-sm font-medium transition-all duration-150 hover:border-white hover:bg-white/10"
                    style={{ color: "#FFFFFF" }}
                  >
                    Login
                  </Link>
                  <Link
                    href="#"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-full px-4 py-3 text-center text-sm font-semibold transition-all duration-150 hover:scale-105"
                    style={{ backgroundColor: "#D4A017", color: "#1B2A6B", fontWeight: 700 }}
                  >
                    Join Ark
                  </Link>
                </div>
                <div className="mt-4 text-center text-xs" style={{ color: "#888888" }}>
                  © 2024 ARK Chronicles
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
