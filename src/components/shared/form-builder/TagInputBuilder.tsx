// filepath: e:\ph\Softech Nexus\portfolio-dashboard\src\components\shared\form-builder\TagInputBuilder.tsx
import { Badge } from "@/components/ui/badge";
import { TagInputHelper } from "@/components/ui/badge-helper";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

type TTagInputProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  showHelper?: boolean;
};

const TagInputBuilder = ({
  name,
  label,
  disabled,
  placeholder = "Type and press Enter or use commas to add tags",
  maxTags,
  className,
  showHelper = true,
}: TTagInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Function to add a tag
  const addTag = useCallback(
    (value: string, field: ControllerRenderProps<FieldValues, string>) => {
      const trimmedValue = value.trim();

      if (!trimmedValue) return false;

      // Check if tag already exists
      if (Array.isArray(field.value) && field.value.includes(trimmedValue)) {
        return false;
      }

      // Check maximum tags limit
      if (
        maxTags &&
        Array.isArray(field.value) &&
        field.value.length >= maxTags
      ) {
        return false;
      }

      // Add the new tag to the array
      const newTags = [
        ...(Array.isArray(field.value) ? field.value : []),
        trimmedValue,
      ];
      field.onChange(newTags);

      return true;
    },
    [maxTags]
  );

  // Handle comma-separated input
  const handleCommaSeparatedInput = useCallback(
    (text: string, field: ControllerRenderProps<FieldValues, string>) => {
      if (!text.trim()) return;

      // Handle various formats of lists people might copy/paste
      // Split by commas, semicolons, newlines, or tabs
      const values = text
        .split(/[,;\n\t]/)
        .map((v) => v.trim())
        // Remove quotes that might be in copied content
        .map((v) => v.replace(/^["'`]|["'`]$/g, ""))
        // Remove common list markers
        .map((v) => v.replace(/^[-•*]\s*/, ""))
        .filter((v) => v.length > 0);

      // Add each tag
      let tagsAdded = 0;
      for (const value of values) {
        if (addTag(value, field)) {
          tagsAdded++;
        }

        // Stop if we've reached the max tags
        if (
          maxTags &&
          Array.isArray(field.value) &&
          field.value.length + tagsAdded >= maxTags
        ) {
          break;
        }
      }

      // Return true if any tag was added
      return tagsAdded > 0;
    },
    [addTag, maxTags]
  );

  const handleKeyDown = useCallback(
    (
      e: KeyboardEvent<HTMLInputElement>,
      field: ControllerRenderProps<FieldValues, string>
    ) => {
      const value = inputValue;

      // Check if the Enter key is pressed and there's a value
      if (e.key === "Enter" && value.trim()) {
        e.preventDefault();
        if (addTag(value, field)) {
          // Clear the input only if tag was successfully added
          setInputValue("");
        }
      }
      // Check for comma key press
      else if (e.key === "," && value.trim()) {
        e.preventDefault();
        const textBeforeComma = value.trim();
        if (addTag(textBeforeComma, field)) {
          // Clear the input only if tag was successfully added
          setInputValue("");
        }
      } else if (
        e.key === "Backspace" &&
        value.trim() === "" &&
        Array.isArray(field.value) &&
        field.value.length > 0
      ) {
        // Remove the last tag when backspace is pressed and input is empty
        const newTags = [...field.value];
        newTags.pop();
        field.onChange(newTags);
      }
    },
    [inputValue, addTag]
  );

  const removeTag = useCallback(
    (index: number, field: ControllerRenderProps<FieldValues, string>) => {
      if (!Array.isArray(field.value)) {
        console.warn("Field value is not an array:", field.value);
        return;
      }

      console.log("Before removal:", field.value);
      const newTags = [...field.value];
      newTags.splice(index, 1);
      console.log("After removal:", newTags);

      // Ensure field.onChange is a function
      if (typeof field.onChange !== "function") {
        console.error("field.onChange is not a function:", field.onChange);
        return;
      }

      field.onChange(newTags);
    },
    []
  );

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="capitalize">{label || name}</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2 p-2 bg-background rounded-md border border-input min-h-10 items-center">
              {/* Render existing tags */}
              {Array.isArray(field.value) &&
                field.value.map((tag: string, index: number) => (
                  <button
                    key={`${tag}-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeTag(index, field);
                    }}
                    type="button"
                  >
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1 relative"
                    >
                      {tag}
                      <X className="h-3 w-3 cursor-pointer hover:text-destructive pointer-events-auto" />
                    </Badge>
                  </button>
                ))}

              {/* Input field for new tags */}
              <Input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, field)}
                onPaste={(e) => {
                  // Get pasted text
                  const pastedText = e.clipboardData.getData("text");

                  // If text contains commas, handle it as comma-separated input
                  if (pastedText.includes(",")) {
                    e.preventDefault();
                    if (handleCommaSeparatedInput(pastedText, field)) {
                      // Clear the input only if at least one tag was added
                      setInputValue("");
                    }
                  }
                }}
                className={cn(
                  "border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow min-w-[120px] h-7"
                )}
                placeholder={
                  !Array.isArray(field.value) || field.value.length === 0
                    ? placeholder
                    : undefined
                }
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage />
          {showHelper && <TagInputHelper />}
        </FormItem>
      )}
    />
  );
};

export default TagInputBuilder;
