import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import RichTextEditor from "./RichTextEditor";

type TRichTextEditorProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

const RichTextEditorBuilder = ({
  name,
  label,
  disabled,
  placeholder,
  className,
}: TRichTextEditorProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          <FormLabel className="capitalize">{label || name}</FormLabel>
          <FormControl>
            <RichTextEditor
              content={field.value || ""}
              onChange={field.onChange}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RichTextEditorBuilder;
