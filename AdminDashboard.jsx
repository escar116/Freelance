import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { listPendingUsers, updateUserStatus } from "@work4abit/dataconnect";
import { Button } from "./button";
import { Check, X, User, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "./use-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Strictly check for admin email
  const isAdmin = user?.email === "charlesjanparaggua@gmail.com";

  useEffect(() => {
    if (!isAdmin) return;

    const fetchPending = async () => {
      try {
        const response = await listPendingUsers();
        setPendingUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching pending users:", err);
        toast({ title: "Error", description: "Failed to load pending users", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [isAdmin]);

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await updateUserStatus({ id: userId, status: newStatus });
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      toast({ 
        title: "Success", 
        description: `User has been ${newStatus}` 
      });
    } catch (err) {
      console.error("Error updating user:", err);
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Verification Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve Computer Engineering student registrations.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">All caught up!</h3>
          <p className="text-muted-foreground mt-1">There are no pending registrations to review right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map(u => (
            <div key={u.id} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{u.fullName}</h3>
                  <div className="text-sm text-muted-foreground flex flex-col gap-0.5 mt-1">
                    <span>{u.email}</span>
                    <span>Student ID: <span className="font-medium text-foreground">{u.studentId}</span></span>
                    <span>Faculty Ref: {u.facultyReference || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                {u.certificateUrl && u.certificateUrl !== "none" ? (
                  <a 
                    href={u.certificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-blue-600 hover:underline bg-blue-50 px-4 py-2 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View COE Image
                  </a>
                ) : (
                  <span className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2 rounded-lg">No COE provided</span>
                )}

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    className="flex-1 sm:flex-none border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleUpdateStatus(u.id, "rejected")}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(u.id, "verified")}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
