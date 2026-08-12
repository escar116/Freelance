import { db } from "./mockDb";

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "./button";
import { Image } from "./image";
import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import Avatar from "./Avatar";
import StarRating from "./StarRating";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import { PcbTraces } from "./CircuitDecor";
import { peso } from "./cpe";

export default function ServiceDetail() {
  const { id } = useParams();
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => db.entities.Service.get(id),
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", service?.seller_email],
    queryFn: () => db.entities.Review.filter({ target_email: service.seller_email }),
    enabled: !!service?.seller_email,
  });

  if (isLoading) return <Loader />;
  if (!service)
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <EmptyState title="Service not found" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Button asChild variant="ghost" className="mb-6 text-muted-foreground">
        <Link to="/services">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" /> Back to services
        </Link>
      </Button>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <div className="card-soft overflow-hidden">
            {service.cover_image && (
              <Image src={service.cover_image} alt={service.title} className="w-full h-64 sm:h-80" />
            )}
            <div className="p-6 sm:p-8 space-y-4">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {service.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold text-primary leading-tight">{service.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <StarRating value={service.rating} count={service.reviews_count} />
                <span>·</span>
                <span>{service.completed_jobs || 0} tasks completed</span>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{service.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {(service.skills || []).map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-secondary/20 text-primary">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="card-soft p-6 sm:p-8">
            <h2 className="font-semibold text-primary mb-5">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              <ul className="space-y-5">
                {reviews.map((r) => (
                  <li key={r.id} className="flex gap-3">
                    <Avatar src={r.reviewer_photo} name={r.reviewer_name} className="w-9 h-9" />
                    <div>
                      <p className="text-sm font-medium text-primary">{r.reviewer_name}</p>
                      <StarRating value={r.rating} />
                      <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative card-soft p-6 lg:sticky lg:top-24 overflow-hidden">
          <PcbTraces className="-bottom-10 -right-10 w-64 text-secondary" />
          <div className="relative space-y-5">
            <div>
              <p className="text-xs text-muted-foreground">Starting at</p>
              <p className="text-3xl font-semibold text-primary">{peso(service.price)}</p>
              <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {service.delivery_days} day delivery
              </p>
            </div>
            <Button className="w-full rounded-full h-12">Contact {service.seller_name?.split(" ")[0]}</Button>
            <div className="pt-5 border-t border-border/70 flex items-center gap-3">
              <Avatar src={service.seller_photo} name={service.seller_name} className="w-11 h-11" />
              <div className="min-w-0">
                <Link
                  to={`/students/${encodeURIComponent(service.seller_email || "")}`}
                  className="text-sm font-medium text-primary hover:underline block truncate"
                >
                  {service.seller_name}
                </Link>
              </div>
            </div>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
              Computer Engineering student
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}