import dynamic from "next/dynamic";
import { IPaginatedTableProps } from "./PaginatedTable";

export { default as SimpleTable } from "./SimpleTable";
export { default as TableCell, DefaultCell } from "./TableCell";
export { default as TableRow } from "./TableRow";

export const PaginatedTable = dynamic<IPaginatedTableProps>(
  () => import("./PaginatedTable"),
  {
    ssr: false,
  }
);
