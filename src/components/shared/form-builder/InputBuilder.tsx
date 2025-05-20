import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

type TInputProps = {
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

const InputBuilder = ({
  type = "text",
  name,
  label,
  disabled,
  placeholder,
  className = "",
  description = "",
}: TInputProps) => {
  const handleNegativeValueForNumber = (value: number | string) => {
    if (type === "number") {
      return Number(value) < 0 ? 0 : value;
    } else return value;
  };

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          <FormLabel className="capitalize">{label || name}</FormLabel>
          <FormControl>
            <Input
              type={type}
              {...field}
              value={handleNegativeValueForNumber(field.value)}
              className={`mt-2`}
              disabled={disabled}
              onWheel={(e) => {
                if (type === "number") {
                  e.currentTarget.blur();
                }
              }}
              placeholder={placeholder}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputBuilder;
