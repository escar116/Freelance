import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { toast } from "./use-toast";
import { peso } from "./utils";

export default function ApplicationDialog({ request, me, onClose }) {
  const [amount, setAmount] = useState(request?.budget || "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, "applications"), {
        helpRequestId: request.id,
        helpRequest: request,
        posterId: request.requesterId,
        applicantId: me?.id,
        applicant: {
          fullName: me?.full_name || me?.fullName || me?.email,
          studentId: me?.student_id || me?.studentId,
        },
        priceOffer: Number(amount),
        message: message,
        status: "PENDING",
        createdAt: serverTimestamp(),
      });
      toast({ title: "Application sent", description: `Your offer of ${peso(amount)} was sent.` });
      onClose(true);
    } catch (err) {
      toast({ title: "Could not send application", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!request} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-primary">Apply to Job</DialogTitle>
          <DialogDescription>{request?.title}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Your price offer (₱)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg">Why you are a good fit</Label>
            <Textarea
              id="msg"
              rows={4}
              placeholder="How you can help, your relevant experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full rounded-full h-11" disabled={saving}>
              {saving ? "Applying..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}