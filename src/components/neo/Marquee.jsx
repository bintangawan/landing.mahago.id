import { Sparkle } from "./Decor";

// Pita teks berjalan. Isinya dekoratif (info yang sama ada di section lain),
// jadi disembunyikan dari screen reader.
export default function Marquee({ items, className = "" }) {
  const row = (key) => (
    <ul key={key} className="flex shrink-0 items-center gap-6 pr-6">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-6 whitespace-nowrap font-display font-black uppercase tracking-tight text-lg sm:text-2xl"
        >
          {item}
          <Sparkle className="w-6 h-6 sm:w-7 sm:h-7" outline={false} />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden border-y-2 border-mg-ink py-3 ${className}`}
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
