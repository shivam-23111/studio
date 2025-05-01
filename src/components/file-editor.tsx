
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Info, Save, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from '@/contexts/session-context';
import { db, doc, onSnapshot, updateDoc, setDoc, getDoc, serverTimestamp } from '@/lib/firebase';
import { debounce } from 'lodash'; // Import debounce

// Define SessionData type
interface SessionData {
  fileName: string;
  fileContent: string;
  participants?: any[]; // Add other fields as needed
  lastUpdatedBy?: string;
  updatedAt?: any; // Firestore Timestamp
}


export function FileEditor() {
  const { sessionId, userId, isLoadingAuth } = useSession();
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading initial content
  const [lastSavedVersion, setLastSavedVersion] = useState<string>(''); // Track last saved state
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isUpdatingFromFirestore = useRef(false); // Flag to prevent feedback loop
  const isInitialLoad = useRef(true); // Flag for initial load

  // --- Firestore Integration ---

  // Effect to subscribe to Firestore changes
  useEffect(() => {
    if (!sessionId || isLoadingAuth) {
      setIsLoading(false); // Not loading if no session or auth pending
      setFileContent(''); // Clear content if no session
      setFileName('');
      setLastSavedVersion('');
      isInitialLoad.current = true; // Reset for next session join
      return;
    }

    setIsLoading(true); // Start loading when session ID is available
    isInitialLoad.current = true; // Mark as initial load

    const sessionRef = doc(db, "sessions", sessionId);

    const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SessionData; // Use SessionData type
        setFileName(data.fileName || 'untitled.txt'); // Use || for default

        // Prevent updating local state if it was just saved by the current user
        // Only update if content differs and wasn't just updated by us
        if (data.fileContent !== fileContent && data.lastUpdatedBy !== userId) {
           // Check if it's different from the *last saved* version to avoid race conditions
           if (data.fileContent !== lastSavedVersion) {
            isUpdatingFromFirestore.current = true; // Set flag before updating state
            setFileContent(data.fileContent);
            setLastSavedVersion(data.fileContent); // Update last saved version on external change
             // console.log("Updated content from Firestore by user:", data.lastUpdatedBy);
             if (!isInitialLoad.current) { // Don't toast on initial load
                toast({
                    title: "Content Updated",
                    description: `Changes received from another user.`,
                    duration: 2000,
                 });
             }
            // Reset flag after a short delay to allow React state update
            setTimeout(() => { isUpdatingFromFirestore.current = false; }, 50);
           }
        } else if (data.fileContent !== fileContent && isInitialLoad.current) {
             // Handle initial load or case where content matches but needs sync
             isUpdatingFromFirestore.current = true;
             setFileContent(data.fileContent);
             setLastSavedVersion(data.fileContent);
             // console.log("Initial content loaded from Firestore");
             setTimeout(() => { isUpdatingFromFirestore.current = false; }, 50);
         }
        setIsLoading(false); // Content loaded
        isInitialLoad.current = false; // Mark initial load as complete

      } else {
        // Handle case where session document doesn't exist (e.g., invalid session ID)
        console.error("Session document not found!");
        toast({ title: "Error", description: "Session not found.", variant: "destructive" });
        setFileContent('');
        setFileName('');
        setLastSavedVersion('');
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error listening to session changes:", error);
      toast({ title: "Error", description: "Could not load session data.", variant: "destructive" });
      setIsLoading(false);
      isInitialLoad.current = false;
    });

    // Cleanup subscription on unmount or sessionId change
    return () => unsubscribe();

   // Include fileContent and lastSavedVersion in dependencies cautiously to re-evaluate sync logic
   // Avoid adding them if it causes unnecessary re-subscriptions or loops
   }, [sessionId, userId, isLoadingAuth, toast]); // Keep fileContent out for now to avoid loops


    // Debounced function to save changes to Firestore
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = useCallback(
        debounce(async (newContent: string) => {
        if (!sessionId || !userId || isUpdatingFromFirestore.current) {
            // console.log("Skipping save:", { sessionId, userId, isUpdating: isUpdatingFromFirestore.current });
            return; // Don't save if no session, no user, or if update came from Firestore
        }
        // console.log("Debounced save triggered. isUpdatingFromFirestore:", isUpdatingFromFirestore.current);
        if (newContent === lastSavedVersion) {
            // console.log("Skipping save: Content hasn't changed since last save.");
            return; // Don't save if content hasn't changed
        }

        setIsSaving(true);
        const sessionRef = doc(db, "sessions", sessionId);

        try {
            await updateDoc(sessionRef, {
            fileContent: newContent,
            lastUpdatedBy: userId, // Track who made the last change
            updatedAt: serverTimestamp() // Track update time
            });
            setLastSavedVersion(newContent); // Update last saved version tracker
            // console.log("Content saved to Firestore by user:", userId);
             toast({
                title: "Changes Saved",
                description: "Your changes have been saved.",
                duration: 1500,
             });
        } catch (error) {
            console.error("Error saving content:", error);
            toast({ title: "Save Error", description: "Could not save changes.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
        }, 1000), // Debounce time in milliseconds (e.g., 1 second)
        [sessionId, userId, toast, lastSavedVersion] // Add lastSavedVersion dependency
    );


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!sessionId || !userId) {
        toast({ title: "Action Required", description: "Create or join a session to upload files.", variant: "destructive" });
        return;
    }
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        setFileContent(content); // Update local state immediately
        setFileName(file.name);
        setLastSavedVersion(content); // Set initial saved version for uploaded file

        // Save uploaded content to Firestore immediately (no debounce needed here)
        setIsSaving(true);
        const sessionRef = doc(db, "sessions", sessionId);
        try {
           await updateDoc(sessionRef, {
             fileName: file.name,
             fileContent: content,
             lastUpdatedBy: userId,
             updatedAt: serverTimestamp()
           });
           toast({
             title: "File Uploaded & Synced",
             description: `${file.name} loaded and saved to the session.`,
           });
        } catch(error) {
             console.error("Error uploading file content:", error);
             toast({ title: "Upload Error", description: "Could not sync uploaded file.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
      };
      reader.onerror = () => {
        toast({ title: "Error", description: "Failed to read file.", variant: "destructive" });
      };
      reader.readAsText(file);
    }
     // Reset file input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     // console.log("handleTextChange called. isUpdatingFromFirestore:", isUpdatingFromFirestore.current);
    if (isUpdatingFromFirestore.current) {
      // console.log("Skipping text change processing due to Firestore update.");
       // If the change came from Firestore, just update state and return
       // The flag will be reset shortly after by the useEffect
      setFileContent(event.target.value);
      return;
    }

    const newContent = event.target.value;
    setFileContent(newContent); // Update local state immediately for responsiveness

    // If starting from scratch (no file loaded initially) and text is entered
    if (!fileName && newContent && !sessionId) { // Only set local filename if not in a session
       setFileName('untitled.txt (local)');
    } else if (!newContent && fileName?.endsWith('(local)')) { // Use optional chaining
       setFileName('');
    }

    // Trigger debounced save
     if (sessionId) {
      // console.log("Calling debouncedSave");
       debouncedSave(newContent);
     }
  };

  const triggerFileInput = () => {
     if (!sessionId) {
        toast({ title: "Action Required", description: "Create or join a session first.", variant: "destructive" });
        return;
     }
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 bg-card rounded-lg">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".txt,.js,.ts,.jsx,.tsx,.html,.css,.json,.md" // Example file types
      />
      <Alert variant="default" className="bg-muted/50 border-muted hidden"> {/* Hide prototype message */}
         <Info className="h-4 w-4" />
         <AlertTitle className="font-semibold">Prototype Mode</AlertTitle>
         <AlertDescription className="text-xs">
           File editing and uploads are currently local to your browser session. Real-time sharing requires backend integration.
         </AlertDescription>
       </Alert>
      <div className="flex justify-between items-center">
         <span className="text-sm font-medium text-muted-foreground truncate pr-2" title={fileName || 'No file loaded'}>
            {sessionId ? (fileName || 'Loading...') : 'No session active'}
         </span>
        <div className="flex items-center space-x-2">
            {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" title="Saving..." />}
         <Button variant="outline" size="sm" onClick={triggerFileInput} disabled={!sessionId || isLoading}>
           <Upload className="mr-2 h-4 w-4" /> Upload File
         </Button>
         {/* Removed Suggest Tags/Desc Button */}
        </div>
      </div>

        {isLoading && sessionId ? (
            <div className="flex-grow flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : !sessionId ? (
             <div className="flex-grow flex items-center justify-center text-muted-foreground">
                <p>Create or join a session to start collaborating.</p>
            </div>
        ) : (
          <Textarea
            placeholder={!sessionId ? "Create or join a session..." : "Paste your code or text here, or upload a file..."}
            value={fileContent}
            onChange={handleTextChange}
            className="flex-grow resize-none font-mono text-sm bg-background" // Ensure textarea fills space
            aria-label="File Content Editor"
            disabled={!sessionId || isLoading || isSaving} // Disable while loading/saving or no session
          />
       )}

    </div>
  );
}
