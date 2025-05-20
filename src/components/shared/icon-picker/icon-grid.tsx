import { Button } from "@/components/ui/button";
import tablerFonts from "@/lib/tabler.json";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Search } from "lucide-react";
import { useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid } from "react-window";

export type IconPickerProps = {
  selectedIcon: string;
  setSelectedIcon:
    | React.Dispatch<React.SetStateAction<string>>
    | ((selectedIcon: string) => void);
};

type IconGridProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & IconPickerProps;
interface ITablerFont {
  name: string;
  svg: string;
}

const IconGrid = ({
  selectedIcon,
  setSelectedIcon,
  setIsOpen,
}: IconGridProps) => {
  const icons = tablerFonts.map((icon: ITablerFont) => icon.name);

  const [searchText, setSearchText] = useState("");

  function handleSelectIcon(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    icon: string
  ) {
    e.preventDefault();
    setSelectedIcon(icon);
    setIsOpen(false);
  }

  return (
    <div className="mx-auto min-h-full w-full overflow-hidden pb-6 pt-10">
      <div
        className={cn("mb-4 flex items-center rounded-lg bg-gray-100/80 px-3")}
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 " />
        <input
          className={cn(
            "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          )}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </div>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => {
          const filteredIcons = icons.filter((icon: string) =>
            icon.toLowerCase().includes(searchText.toLowerCase())
          );

          const columnCount = width > 450 ? 6 : 4;
          const rowCount = Math.ceil(filteredIcons.length / columnCount);

          const columnWidth = Math.ceil(width / columnCount) - 3;
          const rowHeight = columnWidth;

          const cellRenderer = ({ columnIndex, rowIndex, style }: any) => {
            const index = rowIndex * columnCount + columnIndex;
            if (index < filteredIcons.length) {
              const icon = filteredIcons[index];
              return (
                <div
                  style={{
                    ...style,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="outline"
                    onClick={(e) => handleSelectIcon(e, icon)}
                    disabled={icon === selectedIcon}
                  >
                    <Icon icon={icon} className="h-7 w-7 text-slate-500" />
                  </Button>
                </div>
              );
            } else {
              return null;
            }
          };
          return (
            <FixedSizeGrid
              columnCount={columnCount}
              rowCount={rowCount}
              columnWidth={columnWidth}
              rowHeight={rowHeight}
              width={width} // Set the total width of the grid
              height={height} // Set the total height of the grid
            >
              {cellRenderer}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default IconGrid;
