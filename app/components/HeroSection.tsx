"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { HeroInsight } from "./homepageData";

type HeroSectionProps = {
  tag: string;
  title: string;
  description: string;
  imageSeed: string;
  insights: HeroInsight[];
};

export default function HeroSection({
  tag,
  title,
  description,
  imageSeed,
  insights,
}: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
        <motion.article
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-ark-navy shadow-[0_24px_80px_rgba(10,10,10,0.16)]"
        >
          <Image
            src={`https://picsum.photos/seed/${imageSeed}/1440/900`}
            alt="Featured chronicle artwork"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 70vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.08),rgba(10,10,10,0.85))]" />

          <div className="relative flex h-full flex-col justify-end px-6 py-8 sm:px-8 sm:py-10">
            <div className="mb-5 inline-flex w-fit rounded-full bg-ark-gold px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-ark-navy">
              {tag}
            </div>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#featured-chronicles"
                  className="inline-flex items-center rounded-full bg-ark-gold px-6 py-3 text-sm font-semibold text-ark-navy transition-colors duration-150 hover:bg-[#e1b54b]"
                >
                  Read Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#about-ark"
                  className="inline-flex items-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white hover:text-ark-black"
                >
                  About Ark
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.article>

        <div className="flex flex-col gap-4">
          {insights.map((insight, index) => (
            <motion.article
              key={insight.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
                delay: 0.08 + index * 0.08,
              }}
              className="rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(27,42,107,0.08)]"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-ark-gold">
                {insight.label}
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold text-ark-black">
                {insight.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                {insight.copy}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
