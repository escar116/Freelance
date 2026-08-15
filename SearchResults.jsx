import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Input } from "./input";
import { Search } from "lucide-react";
import HelpRequestCard from "./HelpRequestCard";
import Avatar from "./Avatar";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import ApplicationDialog from "./ApplicationDialog";
import { useMe } from "./utils";
import { matchesQuery } from "./utils";
import { CATEGORIES } from "./utils";

// Import Data Connect queries
import { listHelpRequests } from "@work4abit/dataconnect";
import { db } from "./mockDb";

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const { data: me } = useMe();
  const [offerTarget, setOfferTarget] = useState(null);

  const { data: requests = [], isLoading: l1 } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const res = await listHelpRequests();
      return res.data.helpRequests;
    },
  });

  const { data: students = [], isLoading: l2 } = useQuery({
    queryKey: ["students"],
    queryFn: () => db.entities.User.list("-created_date", 200),
  });

  const term = q.toLowerCase();
  
  // Custom matcher for Data Connect HelpRequest format
  const matchesDataConnectQuery = (item, query) => {
    if (!query) return true;
    const t = query.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(t) ||
      (item.description || "").toLowerCase().includes(t) ||
      (item.category || "").toLowerCase().includes(t)
    );
  };

  const r = requests.filter((i) => matchesDataConnectQuery(i, q));
  const people = students.filter(
    (u) =>
      (u.full_name || "").toLowerCase().includes(term) ||
      (u.skills || []).join(" ").toLowerCase().includes(term)
  );
  const cats = CATEGORIES.filter((c) => c.toLowerCase().includes(term));
  const empty = !r.length && !people.length && !cats.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <SectionHeader eyebrow="Search" title={q ? `Results for “${q}”` : "Search Work 4 a bit"} />

      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <Input
          value={q}
          onChange={(e) => setParams({ q: e.target.value })}
          placeholder="Search requests, students, categories..."
          aria-label="Search"
          className="pl-10 h-12 rounded-full bg-card"
        />
      </div>

      {l1 || l2 ? (
        <Loader />
      ) : empty ? (
        <EmptyState title="No matches found" subtitle="Try a different keyword." />
      ) : (
        <>
          {cats.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-primary mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {cats.map((c) => (
                  <Link
                    key={c}
                    to={`/requests?category=${encodeURIComponent(c)}`}
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
        <ApplicationDialog request={offerTarget} me={me} onClose={() => setOfferTarget(null)} />
      )}
    </div>
  );
}