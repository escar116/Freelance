import { db } from "./mockDb";
import { listHelpRequests, listApplicationsByApplicant } from "@work4abit/dataconnect";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import { useMe } from "./utils";
import { peso } from "./utils";
import { Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PcbTraces, BlueprintGrid, HexOutlines } from "./CircuitDecor";

export default function Home() {
  const { data: me, isLoading: meLoading } = useMe();
  
  const { data: reqData, isLoading: rLoading } = useQuery({
    queryKey: ["requests", "home"],
    queryFn: () => listHelpRequests(),
  });

  const { data: appData, isLoading: aLoading } = useQuery({
    queryKey: ["applications", "applicant", me?.id],
    queryFn: () => listApplicationsByApplicant({ userId: me.id }),
    enabled: !!me?.id,
  });
  
  const requests = reqData?.data?.helpRequests || [];
  const applications = appData?.data?.applications || [];
  const appliedCount = applications.length;

  if (meLoading || rLoading || aLoading) return <Loader />;

  // Mix requests for the "RECOMMENDED JOBS" list
  const mixedList = [
    ...requests.slice(0, 6).map(r => ({ ...r, type: 'Request', price: r.budget, link: `/requests` }))
  ];

  return (
    <div className="space-y-8 fade-up pb-8 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <BlueprintGrid />
        <PcbTraces className="-top-6 -right-16 w-[520px] text-secondary hidden lg:block opacity-30" />
        <HexOutlines className="top-10 left-6 w-32 text-accent hidden md:block opacity-40" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-4">
        <h1 className="text-3xl font-semibold text-primary">
          Welcome back, {(me?.full_name || me?.email || "student").split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Applied", value: appliedCount },
          { label: "Completed", value: "0" },
          { label: "Earnings", value: "₱0" },
          { label: "Rating", value: "0.0★" }
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</span>
            <span className="text-3xl font-bold text-primary">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Recommended Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recommended Listings</h2>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {mixedList.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No listings found.</div>
          ) : (
            <div className="divide-y divide-border/70">
              {mixedList.map((item, i) => (
                <Link to={item.link} key={i} className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary text-sm sm:text-base leading-tight">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{item.category?.name || item.category || 'General'}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span className="text-xs font-medium text-secondary">{item.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-right shrink-0">
                    <span className="font-semibold text-primary text-sm sm:text-base">{peso(item.price)}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}