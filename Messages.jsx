import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listConversations,
  listMessages,
  createMessage,
  terminateJob,
  completeJob,
  createReview
} from "@work4abit/dataconnect";
import { useMe } from "./utils";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Avatar from "./Avatar";
import { Button } from "./button";
import { Input } from "./input";
import { MessageSquare, Send, CheckCircle, XCircle, ChevronLeft } from "lucide-react";
import { toast } from "./use-toast";
import ReviewDialog from "./ReviewDialog";

export default function Messages() {
  const { data: me, isLoading: meLoading } = useMe();
  const [activeConvId, setActiveConvId] = useState(null);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: convData, isLoading: cLoading, refetch: refetchConversations } = useQuery({
    queryKey: ["conversations", me?.id],
    queryFn: () => listConversations({ userId: me.id }),
    enabled: !!me?.id,
  });
  
  const conversations = convData?.data?.conversations || [];
  
  useEffect(() => {
    if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  const { data: msgData, isLoading: mLoading, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", activeConvId],
    queryFn: () => listMessages({ conversationId: activeConvId }),
    enabled: !!activeConvId,
    refetchInterval: 3000,
  });

  const messages = msgData?.data?.messages || [];
  const activeConv = conversations.find(c => c.id === activeConvId);
  const isPoster = activeConv?.poster?.id === me?.id;
  const otherUser = isPoster ? activeConv?.applicant : activeConv?.poster;

  const handleSelectConv = (id) => {
    setActiveConvId(id);
    setShowChatMobile(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;

    const text = newMessage;
    setNewMessage("");

    try {
      await createMessage({
        conversationId: activeConvId,
        senderId: me.id,
        content: text,
      });
      refetchMessages();
    } catch (err) {
      toast({ title: "Failed to send", description: err.message, variant: "destructive" });
    }
  };

  const handleTerminate = async () => {
    if (!window.confirm("Are you sure you want to terminate this job? The job will be reopened and this application will be cancelled.")) return;
    try {
      await terminateJob({
        applicationId: activeConv.application.id,
        helpRequestId: activeConv.application.helpRequest.id
      });
      toast({ title: "Job Terminated" });
      refetchConversations();
    } catch (err) {
      toast({ title: "Error terminating job", description: err.message, variant: "destructive" });
    }
  };

  const handleComplete = async () => {
    try {
      await completeJob({
        applicationId: activeConv.application.id,
        helpRequestId: activeConv.application.helpRequest.id
      });
      setReviewOpen(true);
      refetchConversations();
    } catch (err) {
      toast({ title: "Error completing job", description: err.message, variant: "destructive" });
    }
  };

  const handleReviewSubmit = async (rating, comment) => {
    try {
      await createReview({
        rating,
        comment,
        reviewerId: me.id,
        targetUserId: otherUser.id
      });
      toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
      setReviewOpen(false);
    } catch (err) {
      toast({ title: "Error submitting review", description: err.message, variant: "destructive" });
    }
  };

  if (meLoading || cLoading) return <Loader />;

  if (conversations.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 fade-up pb-8 px-4">
        <SectionHeader title="Messages" description="Your conversations with other students" />
        <EmptyState icon={MessageSquare} title="No messages yet" description="When an application is approved, a conversation will appear here." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6 fade-up pb-8 lg:h-[calc(100vh-140px)] h-[calc(100vh-100px)] flex flex-col px-0 lg:px-4">
      <div className="hidden lg:block px-4 lg:px-0">
        <SectionHeader title="Messages" description="Your conversations with other students" />
      </div>

      <div className="flex flex-1 gap-0 lg:gap-6 min-h-0 relative">
        {/* Sidebar */}
        <div className={`lg:w-1/3 w-full lg:card-soft bg-background lg:bg-card overflow-y-auto flex-col divide-y divide-border/50 ${showChatMobile ? 'hidden lg:flex' : 'flex'}`}>
          {conversations.map(conv => {
            const isMePoster = conv.poster.id === me?.id;
            const peer = isMePoster ? conv.applicant : conv.poster;
            const isActive = conv.id === activeConvId;

            return (
              <button
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                className={`flex items-center gap-3 p-4 text-left transition-colors ${isActive ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
              >
                <Avatar src={null} name={peer.fullName} className="w-12 h-12 lg:w-10 lg:h-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className={`font-medium text-base lg:text-sm truncate ${isActive ? 'text-primary' : ''}`}>{peer.fullName}</h4>
                  <p className="text-sm lg:text-xs text-muted-foreground truncate">{conv.application?.helpRequest?.title}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Area */}
        <div className={`lg:flex-1 w-full lg:card-soft bg-card flex-col relative overflow-hidden ${showChatMobile ? 'flex' : 'hidden lg:flex'}`}>
          {activeConvId ? (
            <>
              {/* Chat Header */}
              <div className="p-3 lg:p-4 border-b border-border/70 flex items-center justify-between gap-3 bg-muted/20 lg:bg-card/50">
                <div className="flex items-center gap-2 lg:gap-3">
                  <Button variant="ghost" size="icon" className="lg:hidden shrink-0 -ml-2" onClick={() => setShowChatMobile(false)}>
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Avatar src={null} name={otherUser?.fullName} className="w-10 h-10 hidden sm:block" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-primary truncate">{otherUser?.fullName}</h4>
                    <p className="text-xs text-muted-foreground truncate">{activeConv?.application?.helpRequest?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10 px-2 lg:px-3" onClick={handleTerminate}>
                    <XCircle className="w-4 h-4 lg:mr-1.5" />
                    <span className="hidden lg:inline">Terminate</span>
                  </Button>
                  {isPoster && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-3" onClick={handleComplete}>
                      <CheckCircle className="w-4 h-4 lg:mr-1.5" />
                      <span className="hidden lg:inline">Complete</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background lg:bg-transparent">
                {mLoading ? (
                  <div className="flex justify-center p-4"><Loader /></div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm mt-10">No messages yet. Say hi!</div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender.id === me.id;
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[85%] lg:max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        <div className={`p-3 rounded-2xl whitespace-pre-wrap text-sm lg:text-base shadow-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border/50 rounded-bl-sm text-foreground'}`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-3 lg:p-4 border-t border-border/70 bg-card/50 flex gap-2">
                <Input
                  placeholder="Message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-card h-12"
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0 h-12 w-12" disabled={!newMessage.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
      
      {reviewOpen && (
        <ReviewDialog
          isOpen={reviewOpen}
          onClose={() => setReviewOpen(false)}
          onSubmit={handleReviewSubmit}
          peerName={otherUser?.fullName}
        />
      )}
    </div>
  );
}
