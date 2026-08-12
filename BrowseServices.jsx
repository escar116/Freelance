import { db } from "./mockDb";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "./input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "./button";
import ServiceCard from "./ServiceCard";
import FilterPanel from "./FilterPanel";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import { applyFilters } from "./filtering";

const MAX = 20000;

export default function BrowseServices() {
  const params = new URLSearchParams(window.location.search);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    q: params.get("q") || "",
    category: params.get("category") || "",
    maxPrice: MAX,
    verifiedOnly: false,
    minRating: 0,
    sort: "newest",
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => db.entities.Service.list("-created_date", 200),
  });

  const results = useMemo(() => applyFilters(services, filters, "service"), [services, filters]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SectionHeader
        eyebrow="Marketplace"
        title="Browse Services"
        subtitle="Hire verified Computer Engineering students for the work you need done."
      />

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <Input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Search services, skills, students..."
            aria-label="Search services"
            className="pl-10 h-12 rounded-full bg-card"
          />
        </div>
        <Button
          variant="outline"
          className="lg:hidden rounded-full h-12 px-5"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
          Filters
        </Button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <div className={showFilters ? "block" : "hidden lg:block"}>
          <FilterPanel filters={filters} setFilters={setFilters} max={MAX} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-4">{results.length} service(s) found</p>
          {isLoading ? (
            <Loader />
          ) : results.length === 0 ? (
            <EmptyState title="No services match your filters" subtitle="Try widening your price range or clearing the category." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}