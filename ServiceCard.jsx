import React from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { Button } from "./button";
import { Image } from "./image";
import Avatar from "./Avatar";
import StarRating from "./StarRating";
import { CornerAccent } from "./CircuitDecor";
import { peso } from "./cpe";

export default function ServiceCard({ service }) {
  return (
    <article className="card-soft card-soft-hover overflow-hidden flex flex-col group">
      <CornerAccent className="top-0 right-0 text-secondary z-10" />
      {service.cover_image && (
        <div className="h-40 overflow-hidden">
          <Image
            src={service.cover_image}
            alt={service.title}
            className="w-full h-40 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3">
          <Avatar src={service.seller_photo} name={service.seller_name} className="w-9 h-9" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary truncate">{service.seller_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <StarRating value={service.rating} count={service.reviews_count} />
          <span>·</span>
          <span>{service.completed_jobs || 0} tasks done</span>
        </div>

        <h3 className="font-semibold text-primary leading-snug line-clamp-2">{service.title}</h3>

        <span className="self-start text-[11px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
          {service.category}
        </span>

        <div className="flex flex-wrap gap-1.5">
          {(service.skills || []).slice(0, 3).map((s) => (
            <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/20 text-primary">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-border/70 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-primary">{peso(service.price)}</p>
            <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {service.delivery_days} day{service.delivery_days > 1 ? "s" : ""} delivery
            </p>
          </div>
          <Button asChild size="sm" className="rounded-full">
            <Link to={`/services/${service.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}