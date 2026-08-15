import { db } from "./mockDb";
import { listHelpRequests } from "@work4abit/dataconnect";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "./Loader";
import useMe from "./useMe";
import { peso } from "./cpe";
import { Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { data: me, isLoading: meLoading } = useMe();

  const { data: services = [], isLoading: sLoading } = useQuery({
    queryKey: ["services", "home"],
    queryFn: () => db.entities.Service.list("-popularity", 5),
  });
  
  const { data: reqData, isLoading: rLoading } = useQuery({
    queryKey: ["requests", "home"],
    queryFn: () => listHelpRequests(),
  });
  
  const requests = reqData?.data?.helpRequests || [];

  if (meLoading || sLoading || rLoading) return <Loader />;

  // Mix services and requests for the "RECOMMENDED JOBS" list
  const mixedList = [
    ...services.map(s => ({ ...s, type: 'Service', link: `/services/${s.id}` })),
    ...requests.slice(0, 5).map(r => ({ ...r, type: 'Request', price: r.budget, link: `/requests` }))
  ].sort(() => 0.5 - Math.random()).slice(0, 6); // Mix them up for the dashboard feel

  return (
    <div className="space-y-8 fade-up pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-primary">
          Welcome back, {(me?.full_name || me?.email || "student").split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Applied", value: "5" },
          { label: "Completed", value: "12" },
          { label: "Earnings", value: "₱5,250" },
          { label: "Rating", value: "4.8★" }
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