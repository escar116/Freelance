import React, { useId } from "react";

/** Subtle PCB traces + circuit nodes, purely decorative. */
export function PcbTraces({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 240"
      className={"pointer-events-none absolute opacity-[0.18] " + className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M0 40h90l30-30h120l30 30h130" />
      <path d="M0 120h60l40 40h80l30-30h190" />
      <path d="M20 220h140l40-40h200" />
      <path d="M300 10v60l40 40v90" />
      {[
        [90, 40], [240, 40], [100, 160], [180, 130], [200, 180], [340, 110], [340, 200],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.2" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

/** Blueprint grid backdrop. */
export function BlueprintGrid({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={"pointer-events-none absolute inset-0 " + className}
      style={{
        backgroundImage:
          "linear-gradient(to right, hsl(var(--foreground) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.06) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 78%)",
      }}
    />
  );
}

/** Hexagonal outline cluster. */
export function HexOutlines({ className = "" }) {
  const hex = "M12 1.5 22 7v11L12 23.5 2 18V7z";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 50"
      className={"pointer-events-none absolute opacity-20 " + className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d={hex} transform="translate(4 12)" />
      <path d={hex} transform="translate(26 2)" />
      <path d={hex} transform="translate(26 24)" />
      <path d={hex} transform="translate(48 12)" />
    </svg>
  );
}

/** Circuit-style corner accent for cards. */
export function CornerAccent({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={"pointer-events-none absolute w-8 h-8 opacity-40 " + className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M39 1H14L1 14v25" />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Diagonal section divider. */
export function DiagonalDivider({ flip = false, className = "" }) {
  return (
    <div aria-hidden="true" className={"w-full overflow-hidden leading-none " + className}>
      <svg viewBox="0 0 1440 60" className="w-full h-[40px] md:h-[60px]" preserveAspectRatio="none">
        <polygon
          fill="currentColor"
          points={flip ? "0,0 1440,60 1440,0" : "0,60 1440,0 1440,60"}
        />
      </svg>
    </div>
  );
}

/** Subtle vertical circuit traces for page side gutters. */
export function SideTraces({ className = "", flip = false }) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      className={"pointer-events-none absolute inset-0 h-full w-full " + className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      fill="none"
      stroke="currentColor"
    >
      <defs>
        <pattern id={id} width="44" height="120" patternUnits="userSpaceOnUse">
          <path d="M22 0v120" strokeWidth="1" />
          <path d="M22 60h18M22 30h10M22 90h10" strokeWidth="1" />
          <circle cx="22" cy="60" r="3" fill="currentColor" stroke="none" />
          <circle cx="22" cy="30" r="2" fill="currentColor" stroke="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}