import { Button } from "@/components/ui/button";
import React from "react";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const TableActions: React.FC<TableActionsProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
