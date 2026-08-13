import React from "react";
import { useAuth } from "./AuthContext";
import { Button } from "./button";
import { FileSearch, LogOut } from "lucide-react";

export default function PendingApproval() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-sm text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileSearch className="w-8 h-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-2">Verification Pending</h1>
        
        <p className="text-muted-foreground mb-6">
          Thanks for signing up, {user?.full_name?.split(' ')[0] || "Student"}! 
          We've received your Certificate of Enrollment. An administrator is currently reviewing it to verify your account.
        </p>

        <div className="bg-muted p-4 rounded-xl mb-8">
          <p className="text-sm font-medium">Status: <span className="text-amber-500">In Review</span></p>
          <p className="text-xs text-muted-foreground mt-1">
            This process usually takes a short while. Please check back later.
          </p>
        </div>

        <Button 
          variant="outline" 
          className="w-full h-12"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out for now
        </Button>
      </div>
    </div>
  );
}
