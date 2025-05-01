'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollBar
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Users, Loader2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from '@/contexts/session-context';
import { db, doc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface Participant {
    id: string; // Use userId as the unique ID
    userId: string;
    name: string;
    avatar?: string; // Make avatar optional
    joinedAt?: any; // Firestore Timestamp
}

interface ChatMessage {
    id: string; // Firestore document ID
    senderId: string;
    senderName: string;
    message: string;
    timestamp: any; // Firestore Timestamp
}


export function CollaborationSidebar() {
  const { sessionId, userId, isLoadingAuth } = useSession();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null); // Ref for chat scroll viewport
  const { toast } = useToast(); // Initialize useToast

  const scrollToBottom = () => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTop = chatScrollAreaRef.current.scrollHeight;
    }
  };

  // Effect to listen for participant changes
  useEffect(() => {
    if (!sessionId || isLoadingAuth) {
      setParticipants([]);
      setIsLoadingParticipants(false);
      return;
    }

    setIsLoadingParticipants(true);
    const sessionRef = doc(db, "sessions", sessionId);
    const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const fetchedParticipants = (data?.participants || []).map((p: any) => ({
          id: p.userId, // Use userId as the unique React key source
          userId: p.userId,
          name: p.name || `User ${p.userId.substring(0,4)}`, // Default name
           // Generate placeholder avatar based on user ID
          avatar: `https://picsum.photos/seed/${p.userId}/40/40`,
          joinedAt: p.joinedAt,
        }));
        setParticipants(fetchedParticipants);
      } else {
        console.warn("Session doc not found for participants");
        setParticipants([]); // Clear if session disappears
      }
      setIsLoadingParticipants(false);
    }, (error) => {
      console.error("Error fetching participants:", error);
      setIsLoadingParticipants(false);
       toast({ title: "Error", description: "Could not load participants.", variant: "destructive" });
    });

    return () => unsubscribe();
  }, [sessionId, isLoadingAuth, toast]); // Add toast to dependencies


  // Effect to listen for chat messages
  useEffect(() => {
    if (!sessionId || isLoadingAuth) {
      setChatMessages([]);
      setIsLoadingChat(false);
      return;
    }

    setIsLoadingChat(true);
    const messagesRef = collection(db, "sessions", sessionId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc")); // Order by timestamp

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          senderId: data.senderId,
          senderName: data.senderName || `User ${data.senderId.substring(0,4)}`,
          message: data.message,
          timestamp: data.timestamp,
        });
      });
      setChatMessages(messages);
      setIsLoadingChat(false);
       // Scroll to bottom after messages load or update
       // Use timeout to ensure DOM update before scrolling
      setTimeout(scrollToBottom, 100);
    }, (error) => {
      console.error("Error fetching chat messages:", error);
      setIsLoadingChat(false);
      toast({ title: "Error", description: "Could not load chat.", variant: "destructive" });
    });

    return () => unsubscribe();
  }, [sessionId, isLoadingAuth, toast]); // Add toast to dependencies

   const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault(); // Prevent form submission page reload
        if (!sessionId || !userId || isSending || !newMessage.trim()) return;

        setIsSending(true);
        const messagesRef = collection(db, "sessions", sessionId, "messages");
        const currentUser = participants.find(p => p.userId === userId); // Get current user's name

        try {
            await addDoc(messagesRef, {
                senderId: userId,
                senderName: currentUser?.name || `User ${userId.substring(0, 4)}`, // Use stored name or default
                message: newMessage.trim(),
                timestamp: serverTimestamp(),
            });
            setNewMessage(''); // Clear input field
            // Let the snapshot listener update the UI, scroll handled there
        } catch (error) {
            console.error("Error sending message:", error);
            toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
        } finally {
            setIsSending(false);
        }
   };


  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col h-full bg-card rounded-lg p-4">
        {!sessionId ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium mb-1">No Active Session</p>
                <p className="text-sm">Create or join a session to view participants and chat.</p>
            </div>
        ) : (
            <Tabs defaultValue="chat" className="flex flex-col flex-grow">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" disabled={isLoadingChat}>
                {isLoadingChat && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Chat
                </TabsTrigger>
                <Tooltip>
                <TooltipTrigger asChild>
                    <TabsTrigger value="participants" disabled={isLoadingParticipants}>
                    <Users className="h-4 w-4 mr-1 inline-block sm:hidden md:inline-block" />
                    <span className="hidden sm:inline-block">Participants</span>
                     {isLoadingParticipants ? <Loader2 className="h-3 w-3 ml-1.5 animate-spin"/> : ` (${participants.length})`}
                    </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Users currently in this session.</p>
                </TooltipContent>
                </Tooltip>
            </TabsList>

            {/* Chat Tab */}
             <TabsContent value="chat" className="flex flex-col flex-grow mt-4 space-y-4 overflow-hidden">
                {isLoadingChat ? (
                    <div className="flex-grow flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-grow pr-4" viewportRef={chatScrollAreaRef}>
                        <div className="space-y-4">
                            {chatMessages.length === 0 ? (
                                <p className="text-center text-muted-foreground text-sm italic py-4">No messages yet. Start the conversation!</p>
                            ) : (
                                chatMessages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-2 rounded-lg max-w-[80%] ${msg.senderId === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-xs font-medium mb-1">{msg.senderName}{msg.senderId === userId ? ' (You)' : ''}</p>
                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                    </div>
                                </div>
                                ))
                            )}
                        </div>
                        <ScrollBar orientation="vertical" />
                        </ScrollArea>
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 mt-auto pt-4 border-t">
                            <Input
                                placeholder="Type your message..."
                                className="flex-1"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={isSending || !sessionId}
                                maxLength={500} // Add max length
                            />
                            <Button type="submit" size="icon" disabled={isSending || !sessionId || !newMessage.trim()}>
                                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                     </>
                )}
             </TabsContent>

            {/* Participants Tab */}
             <TabsContent value="participants" className="mt-4 flex-grow overflow-hidden">
                {isLoadingParticipants ? (
                     <div className="flex-grow flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {participants.length === 0 ? (
                             <p className="text-center text-muted-foreground text-sm italic py-4">No participants found (this shouldn't happen if you are in!).</p>
                         ) : (
                            participants.map((p) => (
                            <div key={p.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                                <Avatar className="h-8 w-8">
                                <AvatarImage src={p.avatar} alt={p.name} data-ai-hint="person face" />
                                <AvatarFallback>{p.name?.substring(0, 1) || '?'}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium truncate">{p.name}</span>
                                {p.userId === userId && <Badge variant="outline">You</Badge>}
                            </div>
                            ))
                         )}
                    </div>
                    <ScrollBar orientation="vertical" />
                    </ScrollArea>
                )}
            </TabsContent>
            </Tabs>
        )}
      </div>
    </TooltipProvider>
  );
}
