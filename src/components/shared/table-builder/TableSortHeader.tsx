import { TableHead } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { SortConfig, TableColumn } from "./table.type";

interface TableSortHeaderProps {
  column: TableColumn;
  onSort: (key: string) => void;
  sortConfig?: SortConfig;
}

export function TableSortHeader({
  column,
  onSort,
  sortConfig,
}: TableSortHeaderProps) {
  const isSorted = sortConfig?.key === column.key;
  const direction = sortConfig?.direction;

  return (
    <TableHead
      className={column.sortable ? "cursor-pointer select-none" : ""}
      onClick={() => column.sortable && onSort(column.key)}
    >
      <div className="flex items-center">
        {column.label}
        {column.sortable && (
          <span className="ml-2">
            {isSorted ? (
              direction === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </span>
        )}
      </div>
    </TableHead>
  );
}
