
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ensureAnonymousUser, onAuthStateChanged, User, auth } from '@/lib/firebase';

interface SessionContextProps {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  userId: string | null;
  isLoadingAuth: boolean;
  isJoiningSession: boolean;
  setIsJoiningSession: (joining: boolean) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isJoiningSession, setIsJoiningSession] = useState(false);

  const handleSetSessionId = useCallback((id: string | null) => {
     // Basic validation: ensure it's a reasonable length/format if not null
     if (id && typeof id === 'string' && id.trim().length > 0 && id.trim().length < 50) {
        setSessionId(id.trim().toUpperCase()); // Store normalized ID
     } else if (id === null) {
        setSessionId(null);
     } else {
       console.warn("Invalid session ID format attempted:", id);
     }
   }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoadingAuth(true);
      try {
        // Ensure user is signed in (anonymously for this app)
        await ensureAnonymousUser();
        // The onAuthStateChanged listener will set the userId
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        // Handle auth failure if needed
      } finally {
         // Listener will set loading to false once user state is confirmed
      }
    };

     const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
          handleSetSessionId(null); // Clear session if user logs out
        }
        setIsLoadingAuth(false); // Auth state confirmed
      });

    initAuth();

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [handleSetSessionId]);

  const value = {
    sessionId,
    setSessionId: handleSetSessionId, // Use the validated setter
    userId,
    isLoadingAuth,
    isJoiningSession,
    setIsJoiningSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
