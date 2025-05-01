'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileEditor } from "@/components/file-editor";
import { CollaborationSidebar } from "@/components/collaboration-sidebar";
import { useState } from 'react';
import type { SuggestTagsDescriptionsOutput } from '@/ai/flows/suggest-tags-descriptions';


export function CollaborationArea() {
  const [aiSuggestions, setAiSuggestions] = useState<SuggestTagsDescriptionsOutput | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-3.5rem)] rounded-lg border" // Adjust min-height based on header height
    >
      <ResizablePanel defaultSize={65}>
          <FileEditor setAiSuggestions={setAiSuggestions} setIsLoadingAi={setIsLoadingAi} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35}>
        <CollaborationSidebar aiSuggestions={aiSuggestions} isLoadingAi={isLoadingAi} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
