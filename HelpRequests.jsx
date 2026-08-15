import { listHelpRequests, listApplicationsByApplicant } from "@work4abit/dataconnect";

import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Input } from "./input";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { Button } from "./button";
import HelpRequestCard from "./HelpRequestCard";
import FilterPanel from "./FilterPanel";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import ApplicationDialog from "./ApplicationDialog";
import NewRequestDialog from "./NewRequestDialog";
import { useMe } from "./utils";
import { applyFilters } from "./utils";

const MAX = 20000;

export default function HelpRequests() {
  const params = new URLSearchParams(window.location.search);
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const [showFilters, setShowFilters] = useState(false);
  const [offerTarget, setOfferTarget] = useState(null);
  const [creating, setCreating] = useState(false);
  const [filters, setFilters] = useState({
    q: params.get("q") || "",
    category: params.get("category") || "",
    maxPrice: MAX,
    verifiedOnly: false,
    sort: "newest",
  });

  const { data: queryData, isLoading, refetch: refetchRequests } = useQuery({
    queryKey: ["requests"],
    queryFn: () => listHelpRequests(),
  });
  
  const { data: appData, refetch: refetchApplied } = useQuery({
    queryKey: ["applications", "applicant", me?.id],
    queryFn: () => listApplicationsByApplicant({ userId: me.id }),
    enabled: !!me?.id,
  });

  const requests = queryData?.data?.helpRequests || [];
  const appliedJobIds = new Set((appData?.data?.applications || []).map(a => a.helpRequest.id));

  const results = useMemo(() => applyFilters(requests, filters, "request"), [requests, filters]);
  const refresh = () => {
    refetchRequests();
    refetchApplied();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SectionHeader
        eyebrow="Peer support"
        title="Help Requests"
        subtitle="Students post what they need — send an offer if you can help."
        action={
          <Button className="rounded-full h-11 px-6" onClick={() => setCreating(true)}>
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Post a request
          </Button>
        }
      />

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <Input
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Search requests, categories, students..."
            aria-label="Search help requests"
            className="pl-10 h-12 rounded-full bg-card"
          />
        </div>
        <Button variant="outline" className="lg:hidden rounded-full h-12 px-5" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
          Filters
        </Button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <div className={showFilters ? "block" : "hidden lg:block"}>
          <FilterPanel filters={filters} setFilters={setFilters} max={MAX} showRating={false} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-4">{results.length} request(s) found</p>
          {isLoading ? (
            <Loader />
          ) : results.length === 0 ? (
            <EmptyState title="No help requests match your filters" />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((r) => (
                <HelpRequestCard key={r.id} request={r} onSendOffer={setOfferTarget} me={me} hasApplied={appliedJobIds.has(r.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {offerTarget && (
        <ApplicationDialog
          request={offerTarget}
          me={me}
          onClose={(sent) => {
            setOfferTarget(null);
            if (sent) refresh();
          }}
        />
      )}
      {creating && (
        <NewRequestDialog
          me={me}
          onClose={(created) => {
            setCreating(false);
            if (created) refresh();
          }}
        />
      )}
    </div>
  );
}