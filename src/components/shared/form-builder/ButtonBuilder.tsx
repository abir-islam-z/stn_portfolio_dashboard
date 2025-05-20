"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function ButtonBuilder({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const { formState } = useFormContext();
  return (
    <Button
      className={cn("cursor-pointer", className)}
      disabled={formState.isSubmitting || !formState.isDirty}
    >
      {formState.isSubmitting ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        children
      )}
    </Button>
  );
}
