import dynamic from "next/dynamic";
import { ITableProps } from "components/Table/Table";

export { default as SimpleTable } from "./SimpleTable";
export { default as TableCell, DefaultCell } from "./TableCell";
export { default as TableRow } from "./TableRow";
export { default as Table } from "./Table";

export const PaginatedTable = dynamic<ITableProps>(
  () => import("./PaginatedTable"),
  {
    ssr: false,
  }
);
