import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "./firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

import ProfileView from "./ProfileView";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

export default function StudentProfile() {
  const { email } = useParams();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["student", email],
    queryFn: async () => {
      const decodedEmail = decodeURIComponent(email);
      const q = query(collection(db, "users"), where("email", "==", decodedEmail), limit(1));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
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