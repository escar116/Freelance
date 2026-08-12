import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ value = 0, count, className = "" }) {
  return (
    <span className={"inline-flex items-center gap-1 text-xs " + className}>
      <Star className="w-3.5 h-3.5 fill-[#F5B544] text-[#F5B544]" aria-hidden="true" />
      <span className="font-semibold text-primary">{Number(value).toFixed(1)}</span>
      {count !== undefined && <span className="text-muted-foreground">({count})</span>}
    </span>
  );
}