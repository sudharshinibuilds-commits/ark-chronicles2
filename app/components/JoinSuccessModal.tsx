"use client";

import { AnimatePresence, motion } from "framer-motion";

type JoinSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function JoinSuccessModal({ isOpen, onClose }: JoinSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 99990 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 32 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl"
            style={{ zIndex: 99999 }}
          >
            {/* Gold top accent */}
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #1B2A6B, #D4A017, #1B2A6B)" }} />

            <div className="bg-white px-8 py-8 text-center">
              {/* Animated checkmark / badge */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #1B2A6B 0%, #2E4299 100%)" }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <motion.path
                    d="M8 18.5l7 7 13-13"
                    stroke="#D4A017"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>

              {/* Confetti dots (decorative) */}
              <div className="absolute top-12 left-6 flex gap-1 opacity-40">
                {["#D4A017", "#1B2A6B", "#D4A017"].map((c, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -12, opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  />
                ))}
              </div>
              <div className="absolute top-12 right-6 flex gap-1 opacity-40">
                {["#1B2A6B", "#D4A017", "#1B2A6B"].map((c, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -12, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  />
                ))}
              </div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#D4A017" }}>
                  Welcome to the Cohort
                </p>
                <h2 className="text-2xl font-black text-gray-900 mb-1 leading-tight">
                  Joined Founder Forge <span style={{ color: "#1B2A6B" }}>X</span> 🎉
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  You&apos;re now part of an exclusive community of ambitious student founders. 
                  Your journey with <span className="font-semibold" style={{ color: "#1B2A6B" }}>ARK Chronicles</span> begins here.
                </p>
              </motion.div>

              {/* Divider */}
              <div className="my-5 h-px bg-gray-100" />

              {/* Cohort badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-6"
                style={{ borderColor: "#1B2A6B22", backgroundColor: "#1B2A6B08" }}
              >
                <span className="text-lg">🏆</span>
                <span className="text-sm font-semibold" style={{ color: "#1B2A6B" }}>Founder Forge X — Cohort Member</span>
              </motion.div>

              {/* CTA */}
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all duration-150"
                style={{ backgroundColor: "#1B2A6B" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Start Exploring ARK →
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
