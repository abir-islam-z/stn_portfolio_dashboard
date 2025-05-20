export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableData {
  id: string | number;
  [key: string]: unknown;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}
