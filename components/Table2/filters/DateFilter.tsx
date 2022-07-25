import React, { FC } from "react";
import { ColumnFilter } from "components/Table/filters/types";
import { DatePicker } from "components/base/Pickers";
import { Grid } from "@mui/material";
import { Button } from "components/base";
import { FilterType } from "react-table";
import moment from "moment";

const DateFilter: FC<ColumnFilter> = ({
  column: { filterValue = new Date(), setFilter },
}) => {
  const onChangeDate = (value: Date) => {
    setFilter(value);
  };

  const onClickReset = () => {
    setFilter(undefined);
  };

  return (
    <Grid container flexDirection="column">
      <Grid item>
        <DatePicker value={filterValue} onChange={onChangeDate} />
      </Grid>
      <Grid item>
        <Button onClick={onClickReset}>Reset</Button>
      </Grid>
    </Grid>
  );
};

export const DateFilterRows: FilterType<any> = (
  rows,
  columnIds,
  filterValue
) => {
  const selected = new Set<string>();

  rows.forEach((row) => {
    columnIds.forEach((id) => {
      if (filterValue && moment.isDate(row.values[id])) {
        if (moment(filterValue) === moment(row.values[id])) {
          selected.add(row.id);
        }
      }
    });
  });

  return rows.filter((row) => selected.has(row.id));
};

export default DateFilter;
