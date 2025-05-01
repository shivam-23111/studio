'use client';

import React, { useState, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { suggestTagsDescriptions } from '@/ai/flows/suggest-tags-descriptions';
import type { SuggestTagsDescriptionsOutput } from '@/ai/flows/suggest-tags-descriptions';

interface FileEditorProps {
  setAiSuggestions: (suggestions: SuggestTagsDescriptionsOutput | null) => void;
  setIsLoadingAi: (loading: boolean) => void;
}

export function FileEditor({ setAiSuggestions, setIsLoadingAi }: FileEditorProps) {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
        toast({
          title: "File Uploaded",
          description: `${file.name} loaded successfully.`,
        });
        // Optionally trigger AI suggestions automatically after upload
        // handleSuggestTags();
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read file.",
          variant: "destructive",
        });
      };
      reader.readAsText(file);
    }
     // Reset file input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSuggestTags = useCallback(async () => {
    if (!fileContent || !fileName) {
      toast({
        title: "Cannot Suggest",
        description: "Please upload a file or add content first.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingAi(true);
    setAiSuggestions(null); // Clear previous suggestions
    try {
      const result = await suggestTagsDescriptions({ fileContent, fileName });
      setAiSuggestions(result);
      toast({
        title: "AI Suggestions Ready",
        description: "Tags and description generated.",
      });
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({
        title: "AI Error",
        description: "Failed to generate suggestions.",
        variant: "destructive",
      });
       setAiSuggestions(null);
    } finally {
      setIsLoadingAi(false);
    }
  }, [fileContent, fileName, setAiSuggestions, setIsLoadingAi, toast]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(event.target.value);
     // Consider if AI suggestions should be cleared or updated on manual text change
     // setAiSuggestions(null);
     if (!fileName && event.target.value) {
         setFileName('untitled.txt'); // Set a default filename if text is entered manually
     } else if (!event.target.value) {
         setFileName(''); // Clear filename if text area is empty
     }
  };

  const triggerFileInput = () => {
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
      <div className="flex justify-between items-center">
         <span className="text-sm font-medium text-muted-foreground">{fileName || 'No file loaded'}</span>
        <div className="space-x-2">
         <Button variant="outline" size="sm" onClick={triggerFileInput}>
           <Upload className="mr-2 h-4 w-4" /> Upload File
         </Button>
          <Button variant="outline" size="sm" onClick={handleSuggestTags} disabled={!fileContent || !fileName}>
           <Sparkles className="mr-2 h-4 w-4" /> Suggest Tags/Desc
         </Button>
        </div>
      </div>

      <Textarea
        placeholder="Paste your code or text here, or upload a file..."
        value={fileContent}
        onChange={handleTextChange}
        className="flex-grow resize-none font-mono text-sm bg-background" // Ensure textarea fills space
        aria-label="File Content Editor"
      />

    </div>
  );
}
