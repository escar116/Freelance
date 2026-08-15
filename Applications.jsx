import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listApplicationsForMyRequests,
  listApplicationsByApplicant,
  updateApplicationStatus,
  createConversation,
  createMessage
} from "@work4abit/dataconnect";
import useMe from "./useMe";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Avatar from "./Avatar";
import { Button } from "./button";
import { peso } from "./cpe";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { toast } from "./use-toast";
import { useNavigate } from "react-router-dom";

export default function Applications() {
  const { data: me, isLoading: meLoading } = useMe();
  const [tab, setTab] = useState("posted"); // "posted" or "applied"
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: myPostedData, isLoading: pLoading, refetch: refetchPosted } = useQuery({
    queryKey: ["applications", "poster", me?.id],
    queryFn: () => listApplicationsForMyRequests({ userId: me.id }),
    enabled: !!me?.id && tab === "posted",
  });

  const { data: myAppliedData, isLoading: aLoading, refetch: refetchApplied } = useQuery({
    queryKey: ["applications", "applicant", me?.id],
    queryFn: () => listApplicationsByApplicant({ userId: me.id }),
    enabled: !!me?.id && tab === "applied",
  });

  const postedApps = myPostedData?.data?.applications || [];
  const appliedApps = myAppliedData?.data?.applications || [];

  const handleApprove = async (app) => {
    try {
      // 1. Update application status
      await updateApplicationStatus({
        id: app.id,
        status: "APPROVED"
      });

      // 2. Create conversation
      const convRes = await createConversation({
        posterId: me.id,
        applicantId: app.applicant.id,
        helpRequestId: app.helpRequest.id
      });
      const convId = convRes.data.conversation_insert.id;

      // 3. Create initial message using the applicant's offer details
      await createMessage({
        conversationId: convId,
        senderId: app.applicant.id,
        text: `Application accepted. Price offer: ${peso(app.priceOffer)}\n\nMessage: ${app.message}`
      });

      toast({ title: "Applicant Approved", description: "A conversation has been started in Messages." });
      refetchPosted();
      navigate("/messages");
    } catch (err) {
      toast({ title: "Error approving applicant", description: err.message, variant: "destructive" });
    }
  };

  const handleReject = async (app) => {
    try {
      await updateApplicationStatus({
        id: app.id,
        status: "REJECTED"
      });
      toast({ title: "Applicant Rejected" });
      refetchPosted();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (meLoading || (tab === "posted" && pLoading) || (tab === "applied" && aLoading)) {
    return <Loader />;
  }

  // Filter out REJECTED/APPROVED from posted if we only want to show PENDING ones.
  // Actually, the user said "expire, finished or someone else got approve it should disappear"
  const visiblePostedApps = postedApps.filter(app => app.status === "PENDING");
  
  // For applied apps, we can show PENDING and APPROVED ones.
  const visibleAppliedApps = appliedApps.filter(app => app.status !== "REJECTED");

  return (
    <div className="space-y-6 fade-up pb-8 max-w-5xl mx-auto">
      <SectionHeader
        title="Applications Hub"
        description="Manage job applications and candidates"
      />
      
      <div className="flex border-b border-border/70 mb-6">
        <button 
          onClick={() => setTab("posted")}
          className={`pb-3 px-4 font-medium text-sm transition-colors relative ${tab === "posted" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          Posted Services Candidates
          {tab === "posted" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setTab("applied")}
          className={`pb-3 px-4 font-medium text-sm transition-colors relative ${tab === "applied" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          My Applications
          {tab === "applied" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></span>}
        </button>
      </div>

      {tab === "posted" && (
        visiblePostedApps.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No pending candidates"
            description="You don't have any pending applications for your posted jobs."
          />
        ) : (
          <div className="grid gap-5">
            {visiblePostedApps.map(app => (
              <div key={app.id} className="card-soft p-5 flex flex-col md:flex-row gap-5 items-start md:items-center">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded uppercase tracking-wide">
                      For Job: {app.helpRequest.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar src={null} name={app.applicant.fullName} className="w-10 h-10" />
                    <div>
                      <h4 className="font-semibold text-primary text-base">{app.applicant.fullName}</h4>
                      <p className="text-xs text-muted-foreground">ID: {app.applicant.studentId || "N/A"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                    "{app.message}"
                  </p>
                </div>
                <div className="flex flex-col md:items-end gap-3 min-w-[150px]">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Price Offer</p>
                    <p className="text-xl font-bold text-primary">{peso(app.priceOffer)}</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1 md:flex-none border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handleReject(app)}>
                      Reject
                    </Button>
                    <Button className="flex-1 md:flex-none bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleApprove(app)}>
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === "applied" && (
        visibleAppliedApps.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No applications"
            description="You haven't applied to any jobs yet or your applications were rejected."
          />
        ) : (
          <div className="grid gap-5">
            {visibleAppliedApps.map(app => (
              <div key={app.id} className="card-soft p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary text-lg">{app.helpRequest.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Your Offer: {peso(app.priceOffer)}</p>
                </div>
                <div>
                  {app.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-primary text-sm font-medium">
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></span>
                      Pending Review
                    </span>
                  ) : app.status === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Approved
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
