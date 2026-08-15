import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";
import { Button } from "./button";
import { Star } from "lucide-react";
import { Textarea } from "./textarea";

export default function ReviewDialog({ isOpen, onClose, onSubmit, peerName }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit(rating, comment);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Job Completed!</DialogTitle>
          <DialogDescription>
            Please leave a rating and review for {peerName}. Your feedback helps build trust in our community.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Select a Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`p-1 transition-colors ${
                    star <= (hover || rating) ? "text-yellow-500" : "text-muted"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <Star className="w-8 h-8" fill="currentColor" strokeWidth={0.5} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="text-sm font-medium text-primary mt-1">
                {rating === 1 ? "Poor" : rating === 2 ? "Fair" : rating === 3 ? "Good" : rating === 4 ? "Very Good" : "Excellent"}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Write a Review (Optional)</label>
            <Textarea 
              placeholder="How was your experience working with them?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none h-24"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={rating === 0}>
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
