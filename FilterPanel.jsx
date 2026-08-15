import React from "react";
import { Slider } from "./slider";
import { Switch } from "./switch";
import { Label } from "./label";
import { Button } from "./button";
import { CATEGORIES, peso } from "./utils";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export default function FilterPanel({ filters, setFilters, max = 20000, showRating = true }) {
  const set = (patch) => setFilters({ ...filters, ...patch });

  return (
    <aside className="card-soft p-5 space-y-6 lg:sticky lg:top-24 h-fit" aria-label="Filters">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-primary">Category</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => set({ category: "" })}
            className={
              "text-xs px-3 py-1.5 rounded-full transition-colors " +
              (!filters.category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary/25")
            }
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => set({ category: filters.category === c ? "" : c })}
              className={
                "text-xs px-3 py-1.5 rounded-full transition-colors text-left " +
                (filters.category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary/25")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-primary">
          Max {showRating ? "price" : "budget"}:{" "}
          <span className="font-normal text-muted-foreground">{peso(filters.maxPrice ?? max)}</span>
        </p>
        <Slider
          value={[filters.maxPrice ?? max]}
          min={0}
          max={max}
          step={250}
          onValueChange={([v]) => set({ maxPrice: v })}
          aria-label="Maximum price"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="verified-only" className="text-sm font-semibold text-primary">
          Verified only
        </Label>
        <Switch
          id="verified-only"
          checked={!!filters.verifiedOnly}
          onCheckedChange={(v) => set({ verifiedOnly: v })}
        />
      </div>

      {showRating && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary">Minimum rating</p>
          <div className="flex gap-1.5">
            {[0, 3, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => set({ minRating: r })}
                className={
                  "text-xs px-3 py-1.5 rounded-full " +
                  ((filters.minRating || 0) === r
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-secondary/25")
                }
              >
                {r === 0 ? "Any" : r + "+"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-semibold text-primary">Sort by</p>
        <div className="flex flex-wrap gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => set({ sort: s.value })}
              className={
                "text-xs px-3 py-1.5 rounded-full " +
                (filters.sort === s.value
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary/25")
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full text-muted-foreground"
        onClick={() => setFilters({ category: "", maxPrice: max, verifiedOnly: false, minRating: 0, sort: "newest", q: filters.q || "" })}
      >
        Reset filters
      </Button>
    </aside>
  );
}