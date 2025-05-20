import { cn } from "@/lib/utils";

interface TagInputHelperProps {
  className?: string;
}

export function TagInputHelper({ className }: TagInputHelperProps) {
  return (
    <div className={cn("text-xs text-muted-foreground mt-1", className)}>
      <p>
        Tips: Add multiple tags at once by typing with commas (e.g., "React,
        TypeScript, Redux")
      </p>
      <p>You can also paste comma-separated lists from other applications.</p>
    </div>
  );
}
