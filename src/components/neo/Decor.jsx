// Elemen dekoratif neobrutalism, digambar ulang dari motif layar Auth di Figma
// (sunburst, gelombang, sparkle, tanda X, lingkaran, spiral, logo "G").
// Semua dekorasi aria-hidden dan tidak menerima klik.

const INK = "#0f1720";
const SUN = "#ffd166";

const decorProps = (className) => ({
  className: `pointer-events-none select-none ${className}`,
  "aria-hidden": true,
  focusable: "false",
});

export function Sunburst({ className = "", color = SUN, rays = 18 }) {
  const cx = 58;
  const cy = 58;
  const lines = Array.from({ length: rays }, (_, i) => {
    const angle = (i / rays) * Math.PI * 2;
    return {
      x1: cx + Math.cos(angle) * 26,
      y1: cy + Math.sin(angle) * 26,
      x2: cx + Math.cos(angle) * 50,
      y2: cy + Math.sin(angle) * 50,
    };
  });

  const rayGroup = (stroke, width) =>
    lines.map((l, i) => (
      <line
        key={i}
        {...l}
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
      />
    ));

  return (
    <svg viewBox="0 0 120 120" {...decorProps(className)}>
      <g transform="translate(4 4)">
        {rayGroup(INK, 10)}
        <circle cx={cx} cy={cy} r={30} fill={INK} />
      </g>
      {rayGroup(INK, 10)}
      {rayGroup(color, 5.5)}
      <circle cx={cx} cy={cy} r={30} fill={INK} />
      <circle cx={cx} cy={cy} r={27.5} fill={color} />
    </svg>
  );
}

export function Squiggle({ className = "", color = SUN, rows = 2 }) {
  const wave = (y) =>
    `M2 ${y} q7.5 -8 15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0 t15 0`;
  return (
    <svg viewBox={`0 0 124 ${rows * 16 + 4}`} fill="none" {...decorProps(className)}>
      {Array.from({ length: rows }, (_, i) => (
        <path
          key={i}
          d={wave(10 + i * 16)}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function Sparkle({ className = "", color = SUN, outline = true }) {
  const d =
    "M20 2 C21.6 13 27 18.4 38 20 C27 21.6 21.6 27 20 38 C18.4 27 13 21.6 2 20 C13 18.4 18.4 13 20 2 Z";
  return (
    <svg viewBox="0 0 42 42" {...decorProps(className)}>
      {outline && <path d={d} fill={INK} transform="translate(2 2)" />}
      <path
        d={d}
        fill={color}
        stroke={outline ? INK : "none"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function XMark({ className = "", color = SUN }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...decorProps(className)}>
      <g stroke={color} strokeWidth="3.6" strokeLinecap="round">
        <path d="M4 4 9 9M15 15l5 5M20 4l-5 5M9 15l-5 5" />
      </g>
    </svg>
  );
}

export function DotRings({ className = "", color = SUN, cols = 4, rowsCount = 4 }) {
  const gap = 18;
  return (
    <svg
      viewBox={`0 0 ${cols * gap} ${rowsCount * gap}`}
      fill="none"
      {...decorProps(className)}
    >
      {Array.from({ length: cols * rowsCount }, (_, i) => (
        <circle
          key={i}
          cx={(i % cols) * gap + gap / 2}
          cy={Math.floor(i / cols) * gap + gap / 2}
          r="5.5"
          stroke={color}
          strokeWidth="2.6"
        />
      ))}
    </svg>
  );
}

export function Coil({ className = "", color = SUN, loops = 9 }) {
  return (
    <svg viewBox={`0 0 60 ${loops * 12 + 20}`} fill="none" {...decorProps(className)}>
      {Array.from({ length: loops }, (_, i) => (
        <ellipse
          key={i}
          cx="30"
          cy={14 + i * 12}
          rx="25"
          ry="9"
          stroke={color}
          strokeWidth="3.2"
        />
      ))}
    </svg>
  );
}

// Logo "G" MahaGo (diambil dari public/images/MahaGo Logo.svg)
const G_PATH =
  "M973.03,38.19c-1.22-1.22-2.9-1.98-4.77-1.98h-22c-2.33-4.02-6.68-6.73-11.66-6.73h-29.25c-5.55-15.7-20.51-26.93-38.1-26.93s-32.57,11.24-38.12,26.93h-29.77c-4.99,0-9.33,2.7-11.67,6.73h-22c-3.72,0-6.73,3.02-6.73,6.74,0,1.85.75,3.55,1.97,4.76,1.22,1.22,2.9,1.97,4.76,1.97h22c2.34,4.04,6.68,6.74,11.67,6.74h29.77c.25.69.5,1.38.79,2.04-11.18,4.76-21.24,11.63-29.71,20.09-12.76,12.75-21.87,29.15-25.64,47.5h-38.01c-66.46,0-120.69,53.68-120.88,119.67-.1,32.18,12.39,62.44,35.14,85.2,22.66,22.65,52.8,35.14,84.86,35.14h42.82c13.28,35.85,47.79,61.39,88.26,61.39,26,0,49.53-10.52,66.56-27.57,17.03-17.03,27.57-40.56,27.57-66.55v-188.24c0-38.59-23.23-71.76-56.47-86.28.35-.79.65-1.58.93-2.4h29.25c4.97,0,9.33-2.7,11.66-6.74h22c3.72,0,6.74-3,6.74-6.73,0-1.85-.76-3.55-1.97-4.76h0ZM843.91,29.48c4.66-8.05,13.35-13.47,23.33-13.47s18.67,5.42,23.34,13.47c2.29,3.97,3.59,8.55,3.59,13.47,0,4.07-.89,7.91-2.5,11.37-.33.72-.7,1.42-1.09,2.1-4.67,8.05-13.37,13.47-23.34,13.47s-18.67-5.42-23.33-13.47c-.45-.75-.85-1.52-1.21-2.33-1.54-3.39-2.4-7.17-2.4-11.14,0-4.92,1.31-9.5,3.61-13.47h0ZM913.81,145.1v188.24c0,25.99-21.06,47.06-47.06,47.06-12.99,0-24.76-5.26-33.27-13.78-3.87-3.87-7.07-8.41-9.4-13.43,19.07-13.18,31.59-35.18,31.59-60.06,0-26.75-14.46-50.17-35.97-62.87-10.85-6.41-23.49-10.08-36.97-10.08h-47.06c-13.35,0-24.42,9.99-25.74,23.26l-.02.13c-.02.17-.03.35-.04.5-.06.66-.09,1.32-.09,2v.14c0,.17.02.36.02.53,0,.22.02.42.03.63,0,.23.02.46.04.69.02.2.03.42.04.62.03.23.06.45.09.68.06.5.13.9.19,1.25.04.21.09.44.13.66.03.19.07.37.11.56h.02c.02.12.04.25.07.36.04.16.09.32.12.45.1.37.2.73.32,1.11.07.21.13.42.2.62.49,1.47,1.14,2.89,1.88,4.24.07.14.14.27.23.42.42.72.86,1.41,1.31,2.04.13.17.26.36.39.5.73.99,1.55,1.93,2.41,2.8,4.89,4.89,11.38,7.58,18.3,7.58h34.55c.89,0,1.71-.25,2.41-.66,1.37-.82,2.3-2.31,2.3-4.02l.04-16.15c0-1.71,1.31-2.39,1.71-2.56.4-.16,1.8-.6,3.02.62l39.99,39.97,1.35,1.37c.5.5.79,1.18.79,1.9s-.3,1.45-.85,1.98l-1.29,1.31-40.19,40.19c-1.22,1.22-2.63.76-3.03.6-.4-.17-1.71-.85-1.71-2.57l.04-14.89c0-1.25-.49-2.44-1.38-3.33-.25-.25-.5-.46-.79-.65-.75-.47-1.62-.73-2.53-.73h-34.44c-10.43,0-20.45-2.3-29.78-6.83-23.72-11.53-38.45-35.05-38.45-61.42,0-18.22,7.1-35.36,19.98-48.24h0c5.4-5.4,11.63-9.84,18.47-13.17,9.33-4.53,19.35-6.83,29.78-6.83h94.13c14.27,0,25.87-11.61,25.87-25.89s-11.6-25.89-25.87-25.89h-6.09c7.31-16.5,23.83-28.01,43.05-28.01,26,0,47.06,21.07,47.06,47.06h0Z";

export function GMark({ className = "", color = SUN, shadow = true }) {
  return (
    <svg viewBox="600 -12 400 470" {...decorProps(className)}>
      {shadow && <path d={G_PATH} fill={INK} transform="translate(14 14)" />}
      <path
        d={G_PATH}
        fill={color}
        stroke={INK}
        strokeWidth="9"
        strokeLinejoin="round"
      />
    </svg>
  );
}
