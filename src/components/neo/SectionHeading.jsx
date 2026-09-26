const HIGHLIGHT_TONES = {
  sun: "bg-mg-sun text-mg-ink",
  teal: "bg-mg-teal text-mg-ink",
  cream: "bg-mg-cream text-mg-green-deep",
  green: "bg-mg-green-deep text-mg-cream",
  indigo: "bg-mg-indigo text-white",
  red: "bg-mg-red text-white",
};

// Kata yang "ditempel" seperti stiker di dalam judul
export function Highlight({ children, tone = "sun", className = "" }) {
  return (
    <span
      className={`inline-block -rotate-1 border-2 border-mg-ink rounded-neo shadow-neo-sm px-2 leading-tight ${HIGHLIGHT_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export default function SectionHeading({
  eyebrow,
  icon: Icon,
  title,
  subtitle,
  tone = "light",
  className = "",
}) {
  const onDark = tone === "dark";

  return (
    <div className={`relative text-center mb-10 sm:mb-14 ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 -rotate-2 bg-mg-sun text-mg-ink border-2 border-mg-ink rounded-neo shadow-neo-sm px-3 py-1 mb-5 text-xs font-bold uppercase tracking-wider">
          {Icon && <Icon size={16} aria-hidden="true" />}
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.15] mb-4 ${
          onDark ? "text-mg-cream" : "text-mg-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl mx-auto text-base sm:text-lg ${
            onDark ? "text-mg-cream" : "text-mg-ink/80"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
