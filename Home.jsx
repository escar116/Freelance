import { db } from "./mockDb";

import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "./button";
import { ArrowRight, Plus, Search, User as UserIcon } from "lucide-react";
import ServiceCard from "./ServiceCard";
import HelpRequestCard from "./HelpRequestCard";
import SectionHeader from "./SectionHeader";
import Loader from "./Loader";
import useMe from "./useMe";
import { PcbTraces, BlueprintGrid, HexOutlines } from "./CircuitDecor";
import { CATEGORIES, peso } from "./cpe";

const QUICK = [
  { to: "/requests", label: "Post a help request", icon: Plus },
  { to: "/services", label: "Browse services", icon: Search },
  { to: "/profile", label: "Update my profile", icon: UserIcon },
];

export default function Home() {
  const { data: me, isLoading: meLoading } = useMe();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services", "home"],
    queryFn: () => db.entities.Service.list("-popularity", 6),
  });
  const { data: requests = [] } = useQuery({
    queryKey: ["requests", "home"],
    queryFn: () => db.entities.HelpRequest.list("-created_date", 6),
  });
  const { data: offers = [] } = useQuery({
    queryKey: ["offers", me?.email],
    queryFn: () => db.entities.Offer.filter({ sender_email: me.email }, "-created_date", 5),
    enabled: !!me?.email,
  });

  if (meLoading) return <Loader />;

  const myRequests = requests.filter((r) => r.poster_email === me?.email).slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-card">
        <BlueprintGrid />
        <PcbTraces className="-top-6 -right-16 w-[520px] text-secondary hidden sm:block" />
        <HexOutlines className="bottom-10 left-6 w-32 text-accent hidden md:block" />
        <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-14 sm:pt-16 sm:pb-16 fade-up">
          <p className="text-xs uppercase tracking-[0.18em] text-secondary font-semibold">Dashboard</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold text-primary">
            Welcome back, {(me?.full_name || me?.email || "student").split(" ")[0]}
          </h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center text-sm px-4 py-2 rounded-full bg-muted text-muted-foreground">
              Role: {me?.preferred_role || "Offer My Skills"}
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {QUICK.map((q) => (
            <Link key={q.to} to={q.to} className="card-soft card-soft-hover p-5 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <q.icon className="w-4 h-4 text-primary" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-primary">{q.label}</span>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-10">
        <SectionHeader
          eyebrow="Categories"
          title="Explore Computer Engineering skills"
          subtitle="Every listing belongs to a discipline you already study."
        />
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/services?category=${encodeURIComponent(c)}`}
              className="px-4 py-2.5 rounded-full bg-card border border-border text-sm text-primary hover:border-secondary hover:bg-secondary/10 transition-colors"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <SectionHeader
          eyebrow="Popular now"
          title="Featured services"
          action={
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/services">
                View all <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <SectionHeader eyebrow="Your account" title="Recent activity" />
        <div className="card-soft divide-y divide-border/70">
          {offers.length === 0 && myRequests.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">
              No activity yet — send an offer or post a request to get started.
            </p>
          )}
          {offers.map((o) => (
            <div key={o.id} className="p-5 flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-secondary" aria-hidden="true" />
              <span className="text-primary">
                You sent a {peso(o.amount)} offer on “{o.request_title}”
              </span>
              <span className="ml-auto text-xs text-muted-foreground capitalize">{o.status}</span>
            </div>
          ))}
          {myRequests.map((r) => (
            <div key={r.id} className="p-5 flex items-center gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-primary">You posted “{r.title}”</span>
              <span className="ml-auto text-xs text-muted-foreground">{r.offers_count || 0} offers</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-muted py-16">
        <PcbTraces className="bottom-0 left-0 w-[420px] text-secondary hidden md:block" />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionHeader
            eyebrow="Peer support"
            title="Latest help requests"
            action={
              <Button asChild variant="ghost" className="text-primary">
                <Link to="/requests">
                  View all <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {requests.slice(0, 3).map((r) => (
              <HelpRequestCard key={r.id} request={r} onSendOffer={() => { window.location.href = "/requests"; }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}