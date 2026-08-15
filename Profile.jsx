import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./button";
import { Pencil } from "lucide-react";
import ProfileView from "./ProfileView";
import EditProfileDialog from "./EditProfileDialog";
import Loader from "./Loader";
import { useMe } from "./AuthContext";

export default function Profile() {
  const { data: me, isLoading } = useMe();
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  if (isLoading) return <Loader />;

  return (
    <>
      <ProfileView
        user={me}
        action={
          <Button variant="outline" className="rounded-full" onClick={() => setEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" aria-hidden="true" /> Edit profile
          </Button>
        }
      />
      {editing && (
        <EditProfileDialog
          user={me}
          onClose={(saved) => {
            setEditing(false);
            if (saved) queryClient.invalidateQueries({ queryKey: ["me"] });
          }}
        />
      )}
    </>
  );
}