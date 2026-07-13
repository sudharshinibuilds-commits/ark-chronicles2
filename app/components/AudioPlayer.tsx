"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-black/10 bg-white shadow-2xl shadow-black/20"
    >
      <div className="flex items-center gap-4 p-4">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ark-navy text-white transition-all duration-150 hover:scale-105 hover:bg-[#22378c]"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 4L19 12L5 20V4Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ark-black">
            Featured Chronicle: India's Space-Tech Sector
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
            <motion.div
              className="h-full bg-ark-gold"
              initial={{ width: `${progress}%` }}
              animate={{ width: isPlaying ? "100%" : `${progress}%` }}
              transition={{ duration: isPlaying ? 120 : 0 }}
              onAnimationComplete={() => {
                if (isPlaying) setProgress(0);
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 text-zinc-500 transition-all duration-150 hover:bg-black/5 hover:text-ark-black"
          aria-label="Close player"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
