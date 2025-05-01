'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileEditor } from "@/components/file-editor";
import { CollaborationSidebar } from "@/components/collaboration-sidebar";


export function CollaborationArea() {

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-3.5rem)] rounded-lg border" // Adjust min-height based on header height
    >
      <ResizablePanel defaultSize={65}>
          <FileEditor />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35}>
        <CollaborationSidebar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
