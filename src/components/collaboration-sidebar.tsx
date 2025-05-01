'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Users, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SuggestTagsDescriptionsOutput } from '@/ai/flows/suggest-tags-descriptions';


interface CollaborationSidebarProps {
  aiSuggestions: SuggestTagsDescriptionsOutput | null;
  isLoadingAi: boolean;
}


export function CollaborationSidebar({ aiSuggestions, isLoadingAi }: CollaborationSidebarProps) {
  // Placeholder data - replace with real-time data later
  const participants = [
    { id: '1', name: 'Alice', avatar: 'https://picsum.photos/seed/alice/40/40' },
    { id: '2', name: 'Bob', avatar: 'https://picsum.photos/seed/bob/40/40' },
    { id: '3', name: 'You', avatar: 'https://picsum.photos/seed/you/40/40' },
  ];

  const chatMessages = [
    { id: 'c1', sender: 'Alice', message: 'Hey, can you check line 15?' },
    { id: 'c2', sender: 'Bob', message: 'Sure, looks good to me.' },
    { id: 'c3', sender: 'You', message: 'I\'ll add a comment there.' },
  ];

  return (
    <div className="flex flex-col h-full bg-card rounded-lg p-4">
      <Tabs defaultValue="chat" className="flex flex-col flex-grow">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="participants">
            <Users className="h-4 w-4 mr-1 inline-block sm:hidden md:inline-block" />
             <span className="hidden sm:inline-block">Participants</span> ({participants.length})
            </TabsTrigger>
          <TabsTrigger value="ai">
             <Sparkles className="h-4 w-4 mr-1 inline-block sm:hidden md:inline-block" />
              <span className="hidden sm:inline-block">AI Assistant</span>
            </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex flex-col flex-grow mt-4 space-y-4 overflow-hidden">
           <ScrollArea className="flex-grow pr-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-xs font-medium mb-1">{msg.sender}</p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
           <div className="flex items-center space-x-2 mt-auto pt-4 border-t">
            <Input placeholder="Type your message..." className="flex-1" />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="mt-4 flex-grow">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={p.avatar} alt={p.name} data-ai-hint="person face" />
                    <AvatarFallback>{p.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{p.name}</span>
                   {p.name === 'You' && <Badge variant="outline">You</Badge>}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

         {/* AI Assistant Tab */}
        <TabsContent value="ai" className="mt-4 flex-grow">
           <ScrollArea className="h-full pr-4">
             {isLoadingAi && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Generating suggestions...</span>
                </div>
              )}
             {!isLoadingAi && !aiSuggestions && (
                <div className="text-center text-muted-foreground p-8">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Click the "Suggest Tags/Desc" button in the editor to generate AI suggestions for the current file content.</p>
                </div>
             )}
            {!isLoadingAi && aiSuggestions && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                         <Sparkles className="h-5 w-5 mr-2 text-primary" /> AI Suggestions
                        </CardTitle>
                        <CardDescription>Based on the current file content.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Suggested Tags:</h4>
                             <div className="flex flex-wrap gap-2">
                                {aiSuggestions.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary">{tag}</Badge>
                                ))}
                             </div>
                         </div>
                         <div>
                           <h4 className="font-semibold text-sm mb-2">Suggested Description:</h4>
                           <p className="text-sm bg-muted p-3 rounded-md">{aiSuggestions.description}</p>
                        </div>
                    </CardContent>
                </Card>
             )}
           </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

