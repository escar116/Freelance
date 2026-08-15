import React from "react";
import { CalendarDays, Flame } from "lucide-react";
import { Button } from "./button";
import Avatar from "./Avatar";
import { CornerAccent } from "./CircuitDecor";
import { peso } from "./cpe";

const URGENCY_STYLES = {
  Low: "bg-muted text-muted-foreground",
  Normal: "bg-secondary/25 text-primary",
  Urgent: "bg-accent text-primary",
};

export default function HelpRequestCard({ request, onSendOffer }) {
  return (
    <article className="card-soft card-soft-hover p-5 flex flex-col gap-3">
      <CornerAccent className="top-0 right-0 text-accent" />
      <div className="flex items-center gap-3">
        <Avatar src={null} name={request.requester?.fullName || "Student"} className="w-9 h-9" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">{request.requester?.fullName || "Student"}</p>
        </div>
        <span
          className={
            "ml-auto inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium " +
            (URGENCY_STYLES[request.urgency] || URGENCY_STYLES.Normal)
          }
        >
          {request.urgency === "Urgent" && <Flame className="w-3 h-3" aria-hidden="true" />}
          {request.urgency || "Normal"}
        </span>
      </div>

      <h3 className="font-semibold text-primary leading-snug">{request.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-3">{request.description}</p>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{request.category}</span>
        {request.deadline && (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            Due {request.deadline}
          </span>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-muted-foreground">Budget</p>
          <p className="text-lg font-semibold text-primary">{peso(request.budget)}</p>
        </div>
        <Button size="sm" variant="secondary" className="rounded-full" onClick={() => onSendOffer(request)}>
          Send Offer
        </Button>
      </div>
    </article>
  );
}