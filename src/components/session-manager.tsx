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
// Import firebase instance if needed for backend operations
// import { db, auth } from '@/lib/firebase';

export function SessionManager() {
  const [sessionCode, setSessionCode] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>('');
  const { toast } = useToast();

  // Placeholder function for generating session code
  const generateSessionCode = async () => {
    // TODO: Replace with backend logic to create a unique session ID in Firestore
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
    setIsSessionActive(true);
     toast({
        title: "Session Created (Local)",
        description: `Session code: ${code}. Collaboration features require backend implementation.`,
      });
    // Example Firestore interaction (replace with actual logic):
    // try {
    //   const sessionRef = doc(collection(db, "sessions"));
    //   await setDoc(sessionRef, { createdAt: serverTimestamp(), owner: auth.currentUser?.uid });
    //   setSessionCode(sessionRef.id.substring(0, 6).toUpperCase()); // Use Firestore ID part
    //   setIsSessionActive(true);
    //   toast({ title: "Session Created", description: `Session code: ${sessionCode}` });
    // } catch (error) {
    //   console.error("Error creating session:", error);
    //   toast({ title: "Error", description: "Could not create session.", variant: "destructive" });
    // }
  };

  const copyToClipboard = () => {
    if (!sessionCode) return;
    navigator.clipboard.writeText(sessionCode);
    toast({
        title: "Copied!",
        description: "Session code copied to clipboard.",
      });
  };

  // Placeholder function for joining session
   const handleJoinSession = async () => {
    const codeToJoin = joinCode.trim().toUpperCase();
    if (codeToJoin) {
        // TODO: Add logic to verify session exists in Firestore and join it
        console.log(`Attempting to join session with code: ${codeToJoin}`);
        // Example Firestore check (replace with actual logic):
        // try {
        //   const potentialSessionRef = doc(db, "sessions", codeToJoin); // Assuming code IS the ID prefix
        //   const docSnap = await getDoc(potentialSessionRef);
        //   if (docSnap.exists()) {
        //       setIsSessionActive(true);
        //       setSessionCode(codeToJoin);
        //       toast({ title: "Joined Session", description: `Connected to session ${codeToJoin}.` });
        //       // Add user to participants list, etc.
        //       // Close dialog: find a way to trigger DialogClose programmatically or manage open state
        //   } else {
        //       toast({ title: "Error", description: "Session code not found.", variant: "destructive" });
        //   }
        // } catch (error) {
        //     console.error("Error joining session:", error);
        //     toast({ title: "Error", description: "Could not join session.", variant: "destructive" });
        // }

        // Simulate joining for now
        setIsSessionActive(true);
        setSessionCode(codeToJoin);
        toast({
            title: "Joined Session (Local)",
            description: `Connected to session ${codeToJoin}. Collaboration features require backend implementation.`,
        });
        // Ideally close the dialog on successful join. Requires managing dialog open state.
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
    // TODO: Add logic to disconnect from session backend (e.g., remove user from participants list in Firestore)
    console.log(`Leaving session: ${sessionCode}`);
    setIsSessionActive(false);
    setSessionCode('');
     toast({
        title: "Left Session",
        description: "Disconnected from the session.",
      });
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
                  Generate a unique code to share with collaborators. Collaboration requires backend setup.
                </DialogDescription>
              </DialogHeader>
              {sessionCode && isSessionActive ? ( // Check isSessionActive too
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
                    <p className="text-center text-muted-foreground">Click below to generate a local session code.</p>
                 </div>
              )}

              <DialogFooter>
                 {sessionCode && isSessionActive ? (
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
                  Enter the session code provided by the host. Collaboration requires backend setup.
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
                    maxLength={6} // Assuming 6-char codes
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                     <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                 {/* Keep dialog open on Join click until successful? Needs state management */}
                 <Button type="button" onClick={handleJoinSession}>Join</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
