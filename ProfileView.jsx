import React from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Image } from "./image";
import Avatar from "./Avatar";
import StarRating from "./StarRating";
import { BlueprintGrid, HexOutlines } from "./CircuitDecor";

const AVAILABILITY = {
  Available: "bg-secondary/25 text-primary",
  Busy: "bg-accent text-primary",
  Unavailable: "bg-muted text-muted-foreground",
};

export default function ProfileView({ user, action }) {
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", user?.email],
    queryFn: async () => {
      // Stub for future reviews feature
      return [];
    },
    enabled: !!user?.email,
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["applications", "applicant", user?.id],
    queryFn: async () => {
      const q = query(
        collection(db, "applications"),
        where("applicantId", "==", user.id)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    enabled: !!user?.id,
  });
  
  const applicationsCount = applications.length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <section className="relative card-soft overflow-hidden">
        <BlueprintGrid />
        <HexOutlines className="top-4 right-4 w-24 text-secondary hidden sm:block" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
          <Avatar src={user?.photo_url || user?.certificateUrl} name={user?.full_name || user?.fullName} className="w-20 h-20 sm:w-24 sm:h-24 text-lg" />
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-semibold text-primary">{user?.full_name || user?.fullName || user?.email}</h1>
              <p className="text-sm text-muted-foreground">
                Computer Engineering · {user?.preferred_role || user?.preferredRole || "Student"}
                {user?.student_id || user?.studentId ? ` · ID ${user.student_id || user.studentId}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={"text-[11px] px-2.5 py-1 rounded-full font-medium " + (AVAILABILITY[user?.availability] || AVAILABILITY.Available)}>
                {user?.availability || "Available"}
              </span>
              {user?.rating ? <StarRating value={user.rating} count={reviews.length} /> : null}
            </div>
            {user?.bio && <p className="text-sm text-muted-foreground max-w-2xl">{user.bio}</p>}
          </div>
          {action}
        </div>
      </section>

      <div className="grid sm:grid-cols-3 gap-5">
        {[
          { label: "Completed jobs", value: user?.completed_projects || 0 },
          { label: "Reviews", value: reviews.length },
          { label: "Active applications", value: applicationsCount },
        ].map((s) => (
          <div key={s.label} className="card-soft p-6">
            <p className="text-3xl font-semibold text-primary">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-xl font-semibold text-primary mb-5">Credentials & details</h2>
        <div className="card-soft p-6 grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs text-muted-foreground">Faculty reference</p>
            <p className="mt-1.5 text-sm font-medium text-primary">{user?.faculty_reference || user?.facultyReference || "Not provided"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Student ID</p>
            <p className="mt-1.5 text-sm font-medium text-primary">{user?.student_id || user?.studentId || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Program</p>
            <p className="mt-1.5 text-sm font-medium text-primary">Computer Engineering</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gender</p>
            <p className="mt-1.5 text-sm font-medium text-primary">{user?.gender || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Verification Status</p>
            <p className="mt-1.5 text-sm font-medium text-primary capitalize">{user?.verificationStatus || "Pending"}</p>
          </div>
        </div>
      </section>

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
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}