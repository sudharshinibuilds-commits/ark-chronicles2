"use client";

import { motion } from "framer-motion";

const bookPaths = [
  "M24 84C44 72 64 70 88 76",
  "M22 94C46 84 66 82 90 88",
  "M20 104C46 96 68 94 92 100",
  "M98 76C122 70 142 72 162 84",
  "M96 88C120 82 140 84 164 94",
  "M94 100C118 94 140 96 166 104",
];

const sunRays = [
  { x1: 63, y1: 42, x2: 48, y2: 22 },
  { x1: 79, y1: 34, x2: 69, y2: 10 },
  { x1: 95, y1: 30, x2: 95, y2: 6 },
  { x1: 111, y1: 34, x2: 121, y2: 10 },
  { x1: 127, y1: 42, x2: 142, y2: 22 },
  { x1: 141, y1: 53, x2: 160, y2: 39 },
];

function SunriseBookMark() {
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 188 124"
      className="h-32 w-44 sm:h-36 sm:w-48"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
    >
      {bookPaths.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke="#0A0A0A"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            delay: 1.05 + index * 0.08,
            duration: 0.2,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.path
        d="M94 72L94 111"
        fill="none"
        stroke="#0A0A0A"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.2, ease: "easeOut" }}
      />

      {sunRays.map((ray, index) => (
        <motion.line
          key={`${ray.x1}-${ray.y1}`}
          {...ray}
          stroke="#D4A017"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            delay: 1.5 + index * 0.1,
            duration: 0.2,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.path
        d="M55 68C67 46 82 35 95 35C108 35 123 46 135 68"
        fill="none"
        stroke="#D4A017"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.3, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex max-w-3xl flex-col items-center text-center">
        <div className="flex items-end gap-1 sm:gap-2">
          <motion.span
            className="font-display text-[72px] font-black leading-none sm:text-[80px] text-ark-black"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0, duration: 0.4, ease: "easeOut" }}
          >
            A
          </motion.span>
          
          <motion.span
            className="font-display text-[72px] font-black leading-none sm:text-[80px] text-ark-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.2 }}
          >
            .
          </motion.span>

          <motion.span
            className="font-display text-[72px] font-black leading-none sm:text-[80px] text-ark-navy"
            style={{ color: "#1B2A6B" }}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          >
            R
          </motion.span>

          <motion.span
            className="font-display text-[72px] font-black leading-none sm:text-[80px] text-ark-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.2 }}
          >
            .
          </motion.span>

          <motion.span
            className="font-display text-[72px] font-black leading-none sm:text-[80px] text-ark-black"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
          >
            K
          </motion.span>
        </div>

        <div className="mt-6">
          <SunriseBookMark />
        </div>

        <motion.p
          className="mt-4 font-display text-[48px] font-black tracking-normal sm:text-[52px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.3, ease: "easeOut" }}
        >
          <span className="text-ark-black">A</span>
          <span className="text-ark-black">.</span>
          <span className="text-ark-navy" style={{ color: "#1B2A6B" }}>R</span>
          <span className="text-ark-black">.</span>
          <span className="text-ark-black">K</span>
          <span className="text-ark-black"> </span>
          <span className="text-ark-black">CHRONICLE</span>
        </motion.p>

        <motion.div
          className="mt-4 flex items-center gap-3 text-[14px] font-black uppercase tracking-[0.18em] text-ark-navy sm:text-[14px]"
          style={{ color: "#1B2A6B", letterSpacing: "3px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3, duration: 0.3, ease: "easeOut" }}
        >
          <span className="h-px w-10 bg-ark-gold sm:w-16" style={{ backgroundColor: "#D4A017" }} />
          <span>Architects of Rising Knowledge</span>
          <span className="h-px w-10 bg-ark-gold sm:w-16" style={{ backgroundColor: "#D4A017" }} />
        </motion.div>
      </div>
    </motion.div>
  );
}
