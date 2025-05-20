import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TTextAreaProps = {
  rows?: number;
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

const TextAreaBuilder = ({
  name,
  label,
  rows = 10,
  disabled,
  placeholder,
  className = "",
}: TTextAreaProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          <FormLabel>
            {label || name.charAt(0).toUpperCase() + name.slice(1)}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              className="mt-2"
              disabled={disabled}
              rows={rows}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextAreaBuilder;
