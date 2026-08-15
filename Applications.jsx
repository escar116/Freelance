import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listMyHelpRequestsWithApplications,
  listApplicationsByApplicant,
  updateApplicationStatus,
  createConversation,
  createMessage,
  updateHelpRequestStatus
} from "@work4abit/dataconnect";
import { useMe } from "./utils";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Avatar from "./Avatar";
import { Button } from "./button";
import { peso } from "./utils";
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
    queryFn: () => listMyHelpRequestsWithApplications({ userId: me.id }),
    enabled: !!me?.id && tab === "posted",
  });

  const { data: myAppliedData, isLoading: aLoading, refetch: refetchApplied } = useQuery({
    queryKey: ["applications", "applicant", me?.id],
    queryFn: () => listApplicationsByApplicant({ userId: me.id }),
    enabled: !!me?.id && tab === "applied",
  });

  const postedJobs = myPostedData?.data?.helpRequests || [];
  const appliedApps = myAppliedData?.data?.applications || [];

  const handleApprove = async (app, jobId) => {
    try {
      // 1. Update application status
      await updateApplicationStatus({
        id: app.id,
        status: "APPROVED"
      });

      // 1b. Update HelpRequest status to CLOSED
      await updateHelpRequestStatus({
        id: jobId,
        status: "CLOSED"
      });

      // 2. Create conversation
      const convRes = await createConversation({
        posterId: me.id,
        applicantId: app.applicant.id,
        applicationId: app.id
      });
      const convId = convRes.data.conversation_insert.id;

      // 3. Create initial message using the applicant's offer details
      await createMessage({
        conversationId: convId,
        senderId: app.applicant.id,
        content: `Application accepted. Price offer: ${peso(app.priceOffer)}\n\nMessage: ${app.message}`
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

  // Filter out REJECTED/APPROVED applications from the jobs
  const visiblePostedJobs = postedJobs.map(job => ({
    ...job,
    applications: job.applications_on_helpRequest.filter(app => app.status === "PENDING")
  })).filter(job => job.status === "OPEN" || job.status == null); // Only show OPEN jobs, if CLOSED it should disappear
  
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
          Posted Services
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
        visiblePostedJobs.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No posted services"
            description="You don't have any open posted services right now."
          />
        ) : (
          <div className="space-y-8">
            {visiblePostedJobs.map(job => (
              <div key={job.id} className="card-soft overflow-hidden">
                <div className="bg-muted/30 p-4 border-b border-border flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-primary">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">Budget: {peso(job.budget)}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {job.applications.length} Candidates
                  </span>
                </div>
                
                <div className="p-4 bg-card divide-y divide-border/50">
                  {job.applications.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No candidates have applied to this job yet.
                    </div>
                  ) : (
                    job.applications.map(app => (
                      <div key={app.id} className="py-5 first:pt-2 last:pb-2 flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <Avatar src={null} name={app.applicant.fullName} className="w-10 h-10" />
                            <div>
                              <h4 className="font-semibold text-primary text-base">{app.applicant.fullName}</h4>
                              <p className="text-xs text-muted-foreground">ID: {app.applicant.studentId || "N/A"}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/50 mt-2">
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
                            <Button className="flex-1 md:flex-none bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleApprove(app, job.id)}>
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                  ) : app.status === "COMPLETED" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Completed
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
