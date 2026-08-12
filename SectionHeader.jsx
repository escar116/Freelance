import React from "react";

export default function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.18em] text-secondary font-semibold mb-2">{eyebrow}</p>
        )}
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-2 max-w-xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}