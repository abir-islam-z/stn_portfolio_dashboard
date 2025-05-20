import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import React from "react";

interface DownloadButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  fileUrl: string;
  fileName?: string;
  iconSize?: number;
}

export function DownloadButton({
  fileUrl,
  fileName,
  iconSize = 16,
  children,
  className,
  ...props
}: DownloadButtonProps) {
  // Skip rendering if fileUrl is empty
  if (!fileUrl) return null;

  // Extract file name from URL if not provided
  const displayName = fileName || fileUrl.split("/").pop() || "file";

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "inline-flex items-center gap-2 hover:bg-primary/10 hover:text-primary border-primary/20",
        className
      )}
      asChild
      {...props}
    >
      <a
        href={fileUrl}
        download={displayName}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download size={iconSize} className="text-primary" />
        {children || `Download ${displayName}`}
      </a>
    </Button>
  );
}
