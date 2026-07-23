"use client";

import * as React from "react";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, cn } from "@/lib/utils";

interface AvatarUploadProps {
  name?: string | null;
  imageUrl?: string | null;
  onFileSelected: (file: File) => void;
  isUploading?: boolean;
  size?: "md" | "lg";
}

export function AvatarUpload({ name, imageUrl, onFileSelected, isUploading, size = "lg" }: AvatarUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelected(file);
  }

  const dimension = size === "lg" ? "h-24 w-24" : "h-16 w-16";

  return (
    <div className="relative inline-block">
      <Avatar className={dimension}>
        <AvatarImage src={preview ?? imageUrl ?? undefined} alt={name ?? "Profile picture"} />
        <AvatarFallback className="text-xl">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-accent text-accent-foreground shadow-md transition-transform hover:scale-105"
        )}
        aria-label="Upload profile picture"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
