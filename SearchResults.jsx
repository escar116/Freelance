import { db } from "./mockDb";

import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Input } from "./input";
import { Search } from "lucide-react";
import ServiceCard from "./ServiceCard";
import HelpRequestCard from "./HelpRequestCard";
import Avatar from "./Avatar";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import SendOfferDialog from "./SendOfferDialog";
import useMe from "./useMe";
import { matchesQuery } from "./filtering";
import { CATEGORIES } from "./cpe";

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const { data: me } = useMe();
  const [offerTarget, setOfferTarget] = useState(null);

  const { data: services = [], isLoading: l1 } = useQuery({
    queryKey: ["services"],
    queryFn: () => db.entities.Service.list("-created_date", 200),
  });
  const { data: requests = [], isLoading: l2 } = useQuery({
    queryKey: ["requests"],
    queryFn: () => db.entities.HelpRequest.list("-created_date", 200),
  });
  const { data: students = [], isLoading: l3 } = useQuery({
    queryKey: ["students"],
    queryFn: () => db.entities.User.list("-created_date", 200),
  });

  const term = q.toLowerCase();
  const s = services.filter((i) => matchesQuery(i, q));
  const r = requests.filter((i) => matchesQuery(i, q));
  const people = students.filter(
    (u) =>
      (u.full_name || "").toLowerCase().includes(term) ||
      (u.skills || []).join(" ").toLowerCase().includes(term)
  );
  const cats = CATEGORIES.filter((c) => c.toLowerCase().includes(term));
  const empty = !s.length && !r.length && !people.length && !cats.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <SectionHeader eyebrow="Search" title={q ? `Results for “${q}”` : "Search Work 4 a bit"} />

      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={q}
          onChange={(e) => setParams({ q: e.target.value })}
          placeholder="Search services, requests, students, skills, categories..."
          aria-label="Search"
          className="pl-10 h-12 rounded-full bg-card"
        />
      </div>

      {l1 || l2 || l3 ? (
        <Loader />
      ) : empty ? (
        <EmptyState title="No matches found" subtitle="Try a different keyword or skill." />
      ) : (
        <>
          {cats.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-primary mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {cats.map((c) => (
                  <Link
                    key={c}
                    to={`/services?category=${encodeURIComponent(c)}`}
                    className="px-4 py-2 rounded-full bg-card border border-border text-sm text-primary hover:border-secondary"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {people.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-primary mb-4">Students</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {people.map((u) => (
                  <Link
                    key={u.id}
                    to={`/students/${encodeURIComponent(u.email)}`}
                    className="card-soft card-soft-hover p-5 flex items-center gap-3"
                  >
                    <Avatar src={u.photo_url} name={u.full_name} className="w-11 h-11" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{u.full_name || u.email}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {s.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-primary mb-4">Services</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {s.map((i) => <ServiceCard key={i.id} service={i} />)}
              </div>
            </section>
          )}

          {r.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-primary mb-4">Help requests</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {r.map((i) => <HelpRequestCard key={i.id} request={i} onSendOffer={setOfferTarget} />)}
              </div>
            </section>
          )}
        </>
      )}

      {offerTarget && (
        <SendOfferDialog request={offerTarget} me={me} onClose={() => setOfferTarget(null)} />
      )}
    </div>
  );
}