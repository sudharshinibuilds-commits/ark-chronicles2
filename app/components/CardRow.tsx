"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

import type { ArticleCard, FounderCard, MagazineCard } from "./homepageData";

type CardRowProps =
  | {
      id: string;
      title: string;
      seeAllHref: string;
      variant: "article";
      items: ArticleCard[];
    }
  | {
      id: string;
      title: string;
      seeAllHref: string;
      variant: "founder";
      items: FounderCard[];
    }
  | {
      id: string;
      title: string;
      seeAllHref: string;
      variant: "magazine";
      items: MagazineCard[];
    };

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-sm transition-all duration-150 hover:scale-105 hover:bg-ark-gold hover:text-ark-navy"
    >
      {children}
    </button>
  );
}

function ListenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 7.5V16.5M16 7.5V16.5M12 5V19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.5 5.5H13L17 9.5V18.5H7.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M13 5.5V9.5H17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 5.5H17V18.5L12 15L7 18.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-ark-black shadow-lg shadow-black/10 transition-all duration-150 hover:scale-105 hover:bg-ark-navy hover:text-white md:flex md:opacity-0 md:group-hover:opacity-100 ${
        isLeft ? "left-0" : "right-0"
      }`}
      aria-label={`Scroll ${direction}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={isLeft ? "" : "rotate-180"}
      >
        <path
          d="M15 5L8 12L15 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function CardRow(props: CardRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const cardWidth = useMemo(() => {
    if (props.variant === "founder") {
      return 296;
    }
    if (props.variant === "magazine") {
      return 240;
    }

    return 364;
  }, [props.variant]);

  const scrollCards = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const amount = direction === "left" ? -cardWidth : cardWidth;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id={props.id}
      className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-ark-black">
          {props.title}
        </h2>
        <Link
          href={props.seeAllHref}
          className="text-sm font-semibold text-ark-gold transition-all duration-150 hover:scale-105 hover:text-[#b88712]"
        >
          See all
        </Link>
      </div>

      <div className="group relative">
        <ArrowButton direction="left" onClick={() => scrollCards("left")} />
        <ArrowButton direction="right" onClick={() => scrollCards("right")} />

        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {props.variant === "article"
            ? props.items.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.32,
                    ease: "easeOut",
                    delay: index * 0.04,
                  }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="relative h-[320px] w-[280px] shrink-0 snap-start overflow-hidden rounded-[1.6rem] bg-ark-black shadow-[0_20px_55px_rgba(10,10,10,0.12)] sm:w-[340px]"
                >
                  <Image
                    src={`https://picsum.photos/seed/${item.imageSeed}/600/400`}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80vw, 364px"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.04),rgba(10,10,10,0.88))]" />
                  <div className="relative flex h-full flex-col justify-end p-5 text-white">
                    <div className="mb-4 inline-flex w-fit rounded-full bg-ark-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ark-navy">
                      {item.category}
                    </div>
                    <h3 className="font-display text-2xl font-bold leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-3 text-sm text-zinc-300">{item.author}</div>
                    <div className="mt-5 flex items-center gap-2">
                      <IconButton label="Listen">
                        <ListenIcon />
                      </IconButton>
                      <IconButton label="Download PDF">
                        <PdfIcon />
                      </IconButton>
                      <IconButton label="Bookmark">
                        <BookmarkIcon />
                      </IconButton>
                    </div>
                  </div>
                </motion.article>
              ))
            : props.variant === "founder"
            ? (props.items as FounderCard[]).map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.32,
                    ease: "easeOut",
                    delay: index * 0.05,
                  }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="w-[280px] shrink-0 snap-start rounded-[1.6rem] border border-black/8 bg-white p-6 shadow-[0_20px_55px_rgba(27,42,107,0.08)] sm:w-[296px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-ark-gold/20">
                      <Image
                        src={`https://picsum.photos/seed/${item.imageSeed}/300/300`}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-ark-black">
                        {item.name}
                      </h3>
                      <div className="text-sm font-medium text-ark-navy">
                        {item.startup}
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-zinc-600">
                    {item.pitch}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-ark-navy px-3 py-1.5 text-xs font-semibold text-white">
                      {item.streak}
                    </span>
                    <span className="rounded-full bg-ark-gold px-3 py-1.5 text-xs font-semibold text-ark-navy">
                      {item.strikeRate}
                    </span>
                  </div>
                </motion.article>
              ))
            : (props.items as MagazineCard[]).map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.32,
                    ease: "easeOut",
                    delay: index * 0.04,
                  }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="relative h-[400px] w-[200px] shrink-0 snap-start overflow-hidden rounded-[1.6rem] bg-white shadow-[0_20px_55px_rgba(10,10,10,0.12)] sm:w-[240px]"
                >
                  <div className="relative h-[280px] w-full overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/${item.imageSeed}/300/400`}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80vw, 240px"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex rounded-full bg-ark-gold px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ark-navy">
                        {item.edition}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 inline-flex rounded-full bg-ark-navy px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                      {item.category}
                    </div>
                    <h3 className="font-display text-lg font-bold text-ark-black leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-600">{item.month} {item.year}</p>
                    <p className="mt-2 text-xs text-zinc-500 line-clamp-2">{item.description}</p>
                    <button
                      type="button"
                      className="mt-3 w-full rounded-full bg-ark-gold px-3 py-2 text-xs font-semibold text-ark-navy transition-all duration-150 hover:scale-105"
                    >
                      Read Now
                    </button>
                    <button
                      type="button"
                      className="mt-2 w-full rounded-full border border-ark-navy/20 px-3 py-2 text-xs font-semibold text-ark-navy transition-all duration-150 hover:scale-105 hover:border-ark-navy"
                    >
                      Download PDF
                    </button>
                  </div>
                </motion.article>
              ))}
        </div>
      </div>
    </section>
  );
}
