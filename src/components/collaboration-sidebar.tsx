'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export function CollaborationSidebar() {
  // Placeholder data - replace with real-time data later
  const participants = [
    { id: '1', name: 'Alice (Dummy)', avatar: 'https://picsum.photos/seed/alice/40/40' },
    { id: '2', name: 'Bob (Dummy)', avatar: 'https://picsum.photos/seed/bob/40/40' },
    { id: '3', name: 'You (Local)', avatar: 'https://picsum.photos/seed/you/40/40' },
  ];

  const chatMessages = [
    { id: 'c1', sender: 'Alice (Dummy)', message: 'Hey, can you check line 15?' },
    { id: 'c2', sender: 'Bob (Dummy)', message: 'Sure, looks good to me.' },
    { id: 'c3', sender: 'You (Local)', message: 'I\'ll add a comment there.' },
    { id: 'c4', sender: 'Alice (Dummy)', message: 'This chat is just a simulation for now!' },
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col h-full bg-card rounded-lg p-4">
        <Tabs defaultValue="chat" className="flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-2"> {/* Updated grid-cols */}
            <TabsTrigger value="chat">Simulated Chat</TabsTrigger>
             <Tooltip>
               <TooltipTrigger asChild>
                <TabsTrigger value="participants">
                  <Users className="h-4 w-4 mr-1 inline-block sm:hidden md:inline-block" />
                  <span className="hidden sm:inline-block">Participants</span> ({participants.length})
                </TabsTrigger>
               </TooltipTrigger>
               <TooltipContent>
                 <p>Dummy participant data. Real-time list requires backend setup.</p>
               </TooltipContent>
             </Tooltip>

            {/* Removed AI Trigger */}
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex flex-col flex-grow mt-4 space-y-4 overflow-hidden">
             <ScrollArea className="flex-grow pr-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender.startsWith('You') ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-2 rounded-lg max-w-[80%] ${msg.sender.startsWith('You') ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-xs font-medium mb-1">{msg.sender}</p>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
             <div className="flex items-center space-x-2 mt-auto pt-4 border-t">
              <Input placeholder="Chat is simulated..." className="flex-1" disabled />
              <Button size="icon" disabled>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="mt-4 flex-grow">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                 <p className="text-xs text-muted-foreground text-center italic py-2">Showing dummy participants (prototype)</p>
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={p.avatar} alt={p.name} data-ai-hint="person face" />
                      <AvatarFallback>{p.name.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{p.name}</span>
                     {p.name.startsWith('You') && <Badge variant="outline">You</Badge>}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

           {/* Removed AI Assistant Tab Content */}
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
