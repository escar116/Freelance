import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listConversations,
  listMessages,
  createMessage
} from "@work4abit/dataconnect";
import useMe from "./useMe";
import SectionHeader from "./SectionHeader";
import EmptyState from "./EmptyState";
import Loader from "./Loader";
import Avatar from "./Avatar";
import { Button } from "./button";
import { Input } from "./input";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "./use-toast";

export default function Messages() {
  const { data: me, isLoading: meLoading } = useMe();
  const [activeConvId, setActiveConvId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: convData, isLoading: cLoading } = useQuery({
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
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  const messages = msgData?.data?.messages || [];
  const activeConv = conversations.find(c => c.id === activeConvId);
  const otherUser = activeConv?.poster?.id === me?.id ? activeConv?.applicant : activeConv?.poster;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;

    const text = newMessage;
    setNewMessage("");

    try {
      await createMessage({
        conversationId: activeConvId,
        senderId: me.id,
        text: text,
      });
      refetchMessages();
    } catch (err) {
      toast({ title: "Failed to send", description: err.message, variant: "destructive" });
    }
  };

  if (meLoading || cLoading) return <Loader />;

  if (conversations.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 fade-up pb-8">
        <SectionHeader title="Messages" description="Your conversations with other students" />
        <EmptyState icon={MessageSquare} title="No messages yet" description="When an application is approved, a conversation will appear here." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 fade-up pb-8 h-[calc(100vh-140px)] flex flex-col">
      <SectionHeader title="Messages" description="Your conversations with other students" />

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar */}
        <div className="w-1/3 card-soft overflow-y-auto flex flex-col divide-y divide-border/50">
          {conversations.map(conv => {
            const isMePoster = conv.poster.id === me?.id;
            const peer = isMePoster ? conv.applicant : conv.poster;
            const isActive = conv.id === activeConvId;

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`flex items-center gap-3 p-4 text-left transition-colors ${isActive ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
              >
                <Avatar src={null} name={peer.fullName} className="w-10 h-10 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className={`font-medium truncate ${isActive ? 'text-primary' : ''}`}>{peer.fullName}</h4>
                  <p className="text-xs text-muted-foreground truncate">{conv.helpRequest.title}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Area */}
        <div className="flex-1 card-soft flex flex-col relative overflow-hidden">
          {activeConvId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border/70 flex items-center gap-3 bg-card/50">
                <Avatar src={null} name={otherUser?.fullName} className="w-10 h-10" />
                <div>
                  <h4 className="font-semibold text-primary">{otherUser?.fullName}</h4>
                  <p className="text-xs text-muted-foreground">{activeConv?.helpRequest?.title}</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mLoading ? (
                  <div className="flex justify-center p-4"><Loader /></div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm mt-10">No messages yet. Say hi!</div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender.id === me.id;
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                        <div className={`p-3 rounded-2xl whitespace-pre-wrap text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm text-foreground'}`}>
                          {msg.text}
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
              <form onSubmit={handleSend} className="p-4 border-t border-border/70 bg-card/50 flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-card"
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
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
    </div>
  );
}
