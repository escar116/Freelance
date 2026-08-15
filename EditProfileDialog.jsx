import { db } from "./mockDb";

import React, { useState } from "react";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./select";
import { toast } from "./use-toast";

export default function EditProfileDialog({ user, onClose }) {
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState((user?.skills || []).join(", "));
  const [availability, setAvailability] = useState(user?.availability || "Available");
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || "");
  const [saving, setSaving] = useState(false);

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    setPhotoUrl(file_url);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await db.auth.updateMe({
        bio,
        availability,
        photo_url: photoUrl,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      toast({ title: "Profile updated" });
      onClose(true);
    } catch (err) {
      toast({ title: "Could not save", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Profile photo</Label>
            <Input id="photo" type="file" accept="image/*" onChange={uploadPhoto} className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input id="skills" className="h-12" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Availability</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Available", "Busy", "Unavailable"].map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full rounded-full h-11" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}