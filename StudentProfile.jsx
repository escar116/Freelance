import { db } from "./mockDb";

import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ProfileView from "./ProfileView";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

export default function StudentProfile() {
  const { email } = useParams();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["student", email],
    queryFn: () => db.entities.User.filter({ email: decodeURIComponent(email) }),
  });

  if (isLoading) return <Loader />;
  if (!users[0])
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <EmptyState title="Student profile not available" />
      </div>
    );

  return <ProfileView user={users[0]} />;
}