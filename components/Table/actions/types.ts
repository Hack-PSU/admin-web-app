import { ColumnInstance } from "react-table";
import { NamesState } from "types/hooks";

export interface ITableActionProps {
  headers: { [p: string]: ColumnInstance<object> };
  names: NamesState[];
}
