type LiveTickerProps = {
  items: string[];
};

export default function LiveTicker({ items }: LiveTickerProps) {
  const repeatedItems = [...items, ...items];

  return (
    <section className="border-b border-ark-navy/20 bg-ark-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <span className="inline-flex shrink-0 items-center rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-white">
          Live
        </span>
        <div className="ticker-mask flex-1 overflow-hidden">
          <div className="ticker-track flex min-w-max items-center gap-6">
            {repeatedItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-center gap-6 whitespace-nowrap text-sm text-white/90"
              >
                <span>{item}</span>
                <span className="text-ark-gold">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
