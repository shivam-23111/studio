'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Users, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function SessionManager() {
  const [sessionCode, setSessionCode] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>('');
  const { toast } = useToast();

  // Placeholder function for generating session code
  const generateSessionCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
    setIsSessionActive(true);
     toast({
        title: "Session Created",
        description: `Session code: ${code}`,
      });
    // Add logic to initialize session backend
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionCode);
    toast({
        title: "Copied!",
        description: "Session code copied to clipboard.",
      });
  };

  // Placeholder function for joining session
   const handleJoinSession = () => {
    if (joinCode.trim()) {
        // Add logic to connect to session backend with joinCode
        console.log(`Attempting to join session with code: ${joinCode}`);
        setIsSessionActive(true); // Simulate joining
        setSessionCode(joinCode.toUpperCase()); // Display the joined code
         toast({
            title: "Joined Session",
            description: `Connected to session ${joinCode.toUpperCase()}.`,
        });
        // Close the join dialog potentially here after successful join
    } else {
         toast({
            title: "Error",
            description: "Please enter a session code.",
            variant: "destructive",
        });
    }
  };

  // Placeholder function for leaving session
  const leaveSession = () => {
    setIsSessionActive(false);
    setSessionCode('');
     toast({
        title: "Left Session",
      });
    // Add logic to disconnect from session backend
  };


  return (
    <div className="flex items-center space-x-2">
      {isSessionActive ? (
         <>
           <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Session: {sessionCode}</span>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 sm:mr-2"/> <span className="hidden sm:inline">Copy Code</span>
            </Button>
          <Button variant="destructive" size="sm" onClick={leaveSession}>Leave</Button>
         </>
      ) : (
        <>
          {/* Create Session Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><PlusCircle className="h-4 w-4 mr-2" /> Create Session</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
                <DialogDescription>
                  Generate a unique code to share with collaborators.
                </DialogDescription>
              </DialogHeader>
              {sessionCode ? (
                 <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">Share this code:</p>
                    <div className="flex items-center space-x-2">
                     <Input value={sessionCode} readOnly className="font-mono text-lg tracking-widest" />
                     <Button variant="outline" size="icon" onClick={copyToClipboard}>
                       <Copy className="h-4 w-4" />
                     </Button>
                   </div>
                 </div>
              ) : (
                 <div className="py-4">
                    <p className="text-center text-muted-foreground">Click below to generate a session code.</p>
                 </div>
              )}

              <DialogFooter>
                 {sessionCode ? (
                    <DialogClose asChild>
                        <Button type="button">Done</Button>
                    </DialogClose>
                 ) : (
                    <Button type="button" onClick={generateSessionCode}>Generate Code</Button>
                 )}

              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Join Session Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><Users className="h-4 w-4 mr-2" /> Join Session</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Join Session</DialogTitle>
                <DialogDescription>
                  Enter the session code provided by the host.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="session-code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="session-code"
                    placeholder="Enter code..."
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="col-span-3 uppercase font-mono tracking-widest"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                     <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                {/* Keep dialog open on Join click until successful */}
                 <Button type="button" onClick={handleJoinSession}>Join</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
