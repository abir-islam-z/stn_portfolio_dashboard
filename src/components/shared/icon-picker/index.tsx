import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import IconGrid from "./icon-grid";

export type IconPickerProps = {
  selectedIcon: string;
  setSelectedIcon:
    | React.Dispatch<React.SetStateAction<string>>
    | ((selectedIcon: string) => void);
};

const IconPicker = ({ selectedIcon, setSelectedIcon }: IconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-xs" onClick={() => setIsOpen(true)}>
          {selectedIcon ? "Change Icon" : "Add Icon"}
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[400px] overflow-hidden !rounded-3xl text-lg sm:max-w-lg">
        <DialogHeader className="absolute top-6 left-1/2 -translate-x-1/2">
          <DialogTitle>Add Icon</DialogTitle>
        </DialogHeader>
        <IconGrid
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <DialogClose onClick={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;
