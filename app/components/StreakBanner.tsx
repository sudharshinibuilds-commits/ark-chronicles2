export default function StreakBanner() {
  return (
    <section className="border-b border-ark-gold/25 bg-[linear-gradient(90deg,rgba(212,160,23,0.12),rgba(244,244,245,0.9),rgba(212,160,23,0.12))]">
      <div className="mx-auto max-w-7xl px-4 py-3 text-center text-sm font-medium text-ark-black sm:px-6 lg:px-8">
        <span aria-hidden="true">🔥</span>{" "}
        <span className="font-semibold text-ark-navy">5 day reading streak</span>{" "}
        <span className="text-zinc-600">keep building, founder!</span>
      </div>
    </section>
  );
}
