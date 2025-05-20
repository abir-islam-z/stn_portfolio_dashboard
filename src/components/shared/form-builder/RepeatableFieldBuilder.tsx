// filepath: e:\ph\Softech Nexus\portfolio-dashboard\src\components\shared\form-builder\RepeatableFieldBuilder.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { PlusCircle, Trash2 } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

type TRepeatableFieldProps = {
  name: string;
  label?: string;
  addButtonLabel?: string;
  renderField: (fieldName: string, index: number) => ReactNode;
  defaultItem?: Record<string, unknown>;
  maxItems?: number;
  className?: string;
};

const RepeatableFieldBuilder = ({
  name,
  label,
  renderField,
  addButtonLabel,
  defaultItem = {},
  maxItems = Infinity,
  className,
}: TRepeatableFieldProps) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Track initialization to prevent duplicate fields in StrictMode
  const isInitialized = useRef(false);

  // Add an initial field if empty
  useEffect(() => {
    if (fields.length === 0 && !isInitialized.current) {
      isInitialized.current = true;
      append(defaultItem);
    }
  }, [fields.length, append, defaultItem]);

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className={cn("space-y-4", className)}>
          <div className="flex items-center justify-between">
            <FormLabel className="text-base capitalize">
              {label || name}
            </FormLabel>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                console.log(fields);
                if (fields.length < maxItems) {
                  append(defaultItem);
                }
              }}
              disabled={fields.length >= maxItems}
            >
              <PlusCircle className="mr-1" />
              {addButtonLabel || `Add ${label || name}`}
            </Button>
          </div>
          <FormControl>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative rounded-md border border-gray-200 dark:border-gray-800 p-4 pt-6"
                >
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 h-7 w-7"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                  {renderField(`${name}.${index}`, index)}
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RepeatableFieldBuilder;
