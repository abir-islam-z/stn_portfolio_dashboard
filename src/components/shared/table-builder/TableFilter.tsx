import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export interface TableFilterProps {
  // Renamed from onFilterChange to be more descriptive
  onSearchChange?: (value: string) => void;
  searchTerm?: string;
  // Optional props for status filtering
  onStatusChange?: (value: string) => void;
  statusFilter?: string;
  statusOptions?: { value: string; label: string }[];
}

export const TableFilter: React.FC<TableFilterProps> = ({
  onSearchChange,
  searchTerm = "",
  onStatusChange,
  statusFilter,
  statusOptions = [],
}) => {
  return (
    <div className="flex gap-4 mb-4 items-center">
      {onSearchChange && (
        <div className="flex-1">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {onStatusChange && statusOptions.length > 0 && (
        <div className="w-48">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
