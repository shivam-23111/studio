import { Button } from "@/components/ui/button";
import { SessionManager } from "@/components/session-manager";
import { Code, Users } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Code className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-lg">CollabEdit</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <SessionManager />
        </div>
      </div>
    </header>
  );
}
