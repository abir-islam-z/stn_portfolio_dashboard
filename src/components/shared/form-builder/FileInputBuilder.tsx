import { FileUploader } from "@/components/ui/file-uploader";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type TInputProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  maxFileCount?: number;
};

const FileInputBuilder = ({
  name,
  label,
  disabled,
  className,
  maxFileCount,
}: TInputProps) => {
  return (
    <div className={className}>
      <FormField
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="capitalize">{label || name}</FormLabel>
            <FormControl>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                maxFileCount={maxFileCount || 1}
                maxSize={4 * 1024 * 1024}
                disabled={disabled}
                className="mt-2"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FileInputBuilder;
