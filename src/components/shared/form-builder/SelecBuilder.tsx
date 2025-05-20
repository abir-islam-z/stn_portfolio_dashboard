import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type TSelectProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
  options: TOption[];
  className?: string;
};

const SelectBuilder = ({
  options,
  name,
  label,
  disabled,
  placeholder,
  className = "",
  description = "",
}: TSelectProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          <FormLabel>
            {label || name.charAt(0).toUpperCase() + name.slice(1)}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger disabled={disabled} className="mt-2">
                <SelectValue
                  className="capitalize"
                  placeholder={placeholder || `Select ${label || name}`}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            {description ||
              `Select an option for ${
                label || name.charAt(0).toUpperCase() + name.slice(1)
              }`}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectBuilder;
