import produce from "immer";
import { RowData } from "@tanstack/react-table";

export const reorderItems = <TData extends RowData>(
  data: TData[],
  source: number,
  destination: number
) => {
  return produce(data, (draft) => {
    const [removed] = draft.splice(source, 1);
    draft.splice(destination, 0, removed);
  });
};
