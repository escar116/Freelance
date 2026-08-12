import { db } from "./mockDb";

import React, { useState } from "react";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { toast } from "./use-toast";
import { peso } from "./cpe";

export default function SendOfferDialog({ request, me, onClose }) {
  const [amount, setAmount] = useState(request?.budget || "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await db.entities.Offer.create({
        request_id: request.id,
        request_title: request.title,
        amount: Number(amount),
        message,
        sender_name: me?.full_name || me?.email || "Student",
        sender_email: me?.email,
      });
      await db.entities.HelpRequest.update(request.id, {
        offers_count: (request.offers_count || 0) + 1,
      });
      toast({ title: "Offer sent", description: `Your offer of ${peso(amount)} was sent.` });
      onClose(true);
    } catch (err) {
      toast({ title: "Could not send offer", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!request} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-primary">Send an offer</DialogTitle>
          <DialogDescription>{request?.title}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Your price (₱)</Label>
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
            <Label htmlFor="msg">Message</Label>
            <Textarea
              id="msg"
              rows={4}
              placeholder="How you can help, your relevant experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full rounded-full h-11" disabled={saving}>
              {saving ? "Sending..." : "Send Offer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}