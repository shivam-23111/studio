'use client';

import React, { useState, useCallback } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export function FileEditor() {
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
          title: "File Uploaded (Locally)",
          description: `${file.name} loaded into the editor for this session only.`,
        });
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

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(event.target.value);
     if (!fileName && event.target.value) {
         setFileName('untitled.txt (local)'); // Set a default filename if text is entered manually
     } else if (!event.target.value && fileName.endsWith('(local)')) {
         setFileName(''); // Clear filename if text area is empty and was default
     } else if (!event.target.value && fileName) {
          // Keep uploaded filename even if empty, maybe user wants to clear and paste
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
      <Alert variant="default" className="bg-muted/50 border-muted">
         <Info className="h-4 w-4" />
         <AlertTitle className="font-semibold">Prototype Mode</AlertTitle>
         <AlertDescription className="text-xs">
           File editing and uploads are currently local to your browser session. Real-time sharing requires backend integration.
         </AlertDescription>
       </Alert>
      <div className="flex justify-between items-center">
         <span className="text-sm font-medium text-muted-foreground">{fileName || 'No file loaded (Local editing)'}</span>
        <div className="space-x-2">
         <Button variant="outline" size="sm" onClick={triggerFileInput}>
           <Upload className="mr-2 h-4 w-4" /> Upload Local File
         </Button>
         {/* Removed Suggest Tags/Desc Button */}
        </div>
      </div>

      <Textarea
        placeholder="Paste your code or text here, or upload a local file... (Changes are not shared in this prototype)"
        value={fileContent}
        onChange={handleTextChange}
        className="flex-grow resize-none font-mono text-sm bg-background" // Ensure textarea fills space
        aria-label="File Content Editor (Local Prototype)"
      />

    </div>
  );
}
