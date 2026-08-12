import { db } from "./mockDb";

import React, { useState } from "react";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./select";
import { toast } from "./use-toast";
import { CATEGORIES, URGENCY } from "./cpe";

export default function NewRequestDialog({ me, onClose }) {
  const [form, setForm] = useState({
    title: "", description: "", category: CATEGORIES[0], budget: "", deadline: "", urgency: "Normal",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await db.entities.HelpRequest.create({
        ...form,
        budget: Number(form.budget),
        deadline: form.deadline || undefined,
        poster_name: me?.full_name || me?.email || "Student",
        poster_email: me?.email,
        poster_photo: me?.photo_url,
        poster_verified: me?.verification_status === "verified",
        poster_verifier: me?.verified_by,
      });
      toast({ title: "Request posted", description: "Peers can now send you offers." });
      onClose(true);
    } catch (err) {
      toast({ title: "Could not post request", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">Post a help request</DialogTitle>
          <DialogDescription>Describe the technical assistance you need.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="r-title">Title</Label>
            <Input id="r-title" className="h-12" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-desc">Description</Label>
            <Textarea id="r-desc" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select value={form.urgency} onValueChange={(v) => set("urgency", v)}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {URGENCY.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-budget">Budget (₱)</Label>
              <Input id="r-budget" type="number" min="0" className="h-12" value={form.budget} onChange={(e) => set("budget", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-deadline">Deadline</Label>
              <Input id="r-deadline" type="date" className="h-12" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full rounded-full h-11" disabled={saving}>
              {saving ? "Posting..." : "Post request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}