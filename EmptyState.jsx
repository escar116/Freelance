import React from "react";
import { SearchX } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", subtitle }) {
  return (
    <div className="card-soft p-12 text-center">
      <SearchX className="w-8 h-8 mx-auto text-secondary mb-3" aria-hidden="true" />
      <p className="font-medium text-primary">{title}</p>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}