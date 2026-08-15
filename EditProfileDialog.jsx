import React, { useState } from "react";
import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
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

// Helper to compress image
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Max dimensions
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.7 quality
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
    };
  });
};

export default function EditProfileDialog({ user, onClose }) {
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState((user?.skills || []).join(", "));
  const [availability, setAvailability] = useState(user?.availability || "Available");
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || "");
  const [saving, setSaving] = useState(false);

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // We must ensure the file isn't too large since we're using base64 strings in Firestore
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be under 5MB before compression", variant: "destructive" });
      return;
    }
    
    toast({ title: "Compressing image..." });
    const compressedDataUrl = await compressImage(file);
    
    // Safety check: Firestore document size limit is 1MB. 
    // DataURL size in bytes is roughly (length * 3) / 4.
    const sizeInBytes = Math.round((compressedDataUrl.length * 3) / 4);
    if (sizeInBytes > 800000) {
      toast({ title: "Image too large", description: "Image is too large even after compression. Please use a smaller image.", variant: "destructive" });
      return;
    }

    setPhotoUrl(compressedDataUrl);
    toast({ title: "Image compressed and ready" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
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