import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
import React from "react";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function SocialLink({ href, icon, label }: SocialLinkProps) {
  // Skip rendering if href is empty
  if (!href) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 rounded-full hover:bg-primary/10"
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              {icon}
              <span className="sr-only">{label}</span>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-1">
            <span>{label}</span>
            <ExternalLink size={12} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
