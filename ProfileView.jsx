import { db } from "./mockDb";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Image } from "./image";
import Avatar from "./Avatar";
import StarRating from "./StarRating";
import ServiceCard from "./ServiceCard";
import { BlueprintGrid, HexOutlines } from "./CircuitDecor";

const AVAILABILITY = {
  Available: "bg-secondary/25 text-primary",
  Busy: "bg-accent text-primary",
  Unavailable: "bg-muted text-muted-foreground",
};

export default function ProfileView({ user, action }) {
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", user?.email],
    queryFn: () => db.entities.Review.filter({ target_email: user.email }),
    enabled: !!user?.email,
  });
  const { data: services = [] } = useQuery({
    queryKey: ["services", "of", user?.email],
    queryFn: () => db.entities.Service.filter({ seller_email: user.email }),
    enabled: !!user?.email,
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <section className="relative card-soft overflow-hidden">
        <BlueprintGrid />
        <HexOutlines className="top-4 right-4 w-24 text-secondary hidden sm:block" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
          <Avatar src={user?.photo_url} name={user?.full_name} className="w-20 h-20 sm:w-24 sm:h-24 text-lg" />
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-semibold text-primary">{user?.full_name || user?.email}</h1>
              <p className="text-sm text-muted-foreground">
                Computer Engineering · {user?.preferred_role || "Student"}
                {user?.student_id ? ` · ID ${user.student_id}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={"text-[11px] px-2.5 py-1 rounded-full font-medium " + (AVAILABILITY[user?.availability] || AVAILABILITY.Available)}>
                {user?.availability || "Available"}
              </span>
              {user?.rating ? <StarRating value={user.rating} count={reviews.length} /> : null}
            </div>
            {user?.bio && <p className="text-sm text-muted-foreground max-w-2xl">{user.bio}</p>}
            <div className="flex flex-wrap gap-2 pt-1">
              {(user?.skills || []).map((s) => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-secondary/20 text-primary">{s}</span>
              ))}
            </div>
          </div>
          {action}
        </div>
      </section>

      <div className="grid sm:grid-cols-3 gap-5">
        {[
          { label: "Completed projects", value: user?.completed_projects || 0 },
          { label: "Reviews", value: reviews.length },
          { label: "Active services", value: services.length },
        ].map((s) => (
          <div key={s.label} className="card-soft p-6">
            <p className="text-3xl font-semibold text-primary">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-xl font-semibold text-primary mb-5">Credentials & references</h2>
        <div className="card-soft p-6 grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-muted-foreground">Faculty reference</p>
            <p className="mt-1.5 text-sm font-medium text-primary">{user?.faculty_reference || "Not provided"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Student ID</p>
            <p className="mt-1.5 text-sm font-medium text-primary">{user?.student_id || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Program</p>
            <p className="mt-1.5 text-sm font-medium text-primary">Computer Engineering</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary mb-5">Portfolio</h2>
        {(user?.portfolio || []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No portfolio items yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {user.portfolio.map((p, i) => (
              <article key={i} className="card-soft card-soft-hover overflow-hidden">
                {p.image_url && <Image src={p.image_url} alt={p.title} className="w-full h-40" />}
                <div className="p-5">
                  <h3 className="font-semibold text-primary">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {services.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-primary mb-5">Services offered</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-primary mb-5">Ratings & reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="card-soft p-5 flex gap-3">
                <Avatar src={r.reviewer_photo} name={r.reviewer_name} className="w-9 h-9" />
                <div>
                  <p className="text-sm font-medium text-primary">{r.reviewer_name}</p>
                  <StarRating value={r.rating} />
                  <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                  {r.service_title && (
                    <p className="text-xs text-muted-foreground/70 mt-1">on {r.service_title}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}