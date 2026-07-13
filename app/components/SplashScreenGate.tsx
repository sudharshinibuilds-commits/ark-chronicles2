"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import SplashScreen from "./SplashScreen";

const SESSION_KEY = "ark-chronicles-splash-played";
const SPLASH_DURATION_MS = 3500;

type SplashScreenGateProps = {
  children: React.ReactNode;
};

export default function SplashScreenGate({
  children,
}: SplashScreenGateProps) {
  const [checkedSession, setCheckedSession] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasPlayed = window.sessionStorage.getItem(SESSION_KEY) === "true";
    const frame = window.requestAnimationFrame(() => {
      setCheckedSession(true);

      if (!hasPlayed) {
        setShowSplash(true);
      }
    });

    if (!hasPlayed) {
      const timer = window.setTimeout(() => {
        window.sessionStorage.setItem(SESSION_KEY, "true");
        setShowSplash(false);
      }, SPLASH_DURATION_MS);

      return () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
    }

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <div
        className={
          !checkedSession || showSplash ? "pointer-events-none opacity-0" : ""
        }
      >
        {children}
      </div>
      <AnimatePresence>{showSplash ? <SplashScreen /> : null}</AnimatePresence>
    </>
  );
}
