import { FC } from "react";
import Table, { ITableProps } from "./Table";

const PaginatedTable: FC<ITableProps> = ({
  limit,
  names,
  onRefresh,
  onDelete,
  columns,
  data,
}) => {
  return (
    <Table
      limit={limit}
      names={names}
      onRefresh={onRefresh}
      onDelete={onDelete}
      columns={columns}
      data={data}
    >
      <Table.GlobalActions />
      <Table.Container>
        <Table.Actions>
          <Table.ActionsLeft>
            <Table.Filter />
          </Table.ActionsLeft>
          <Table.ActionsCenter>
            <Table.Pagination />
          </Table.ActionsCenter>
          <Table.ActionsRight>
            <Table.Delete />
          </Table.ActionsRight>
        </Table.Actions>
        <Table.Header />
        <Table.Body />
      </Table.Container>
    </Table>
  );
};

export default PaginatedTable;
