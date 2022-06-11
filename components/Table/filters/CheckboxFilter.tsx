import React, { FC, useCallback, useMemo } from "react";
import { ColumnFilter } from "components/Table/filters/types";
import { Checkbox } from "components/base";
import { CheckboxSelectionState } from "types/components";
import { FilterType } from "react-table";
import _ from "lodash";

const CheckboxFilter: FC<ColumnFilter> = ({
  column: { id, setFilter, preFilteredRows, filterValue = [] },
}) => {
  const options = useMemo(() => {
    if (preFilteredRows) {
      const options = new Set<string>();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return Array.from(options).map((option) => ({
        value: option,
        display: _.startCase(_.toLower(option)),
      }));
    }
    return [];
  }, [preFilteredRows, id]);

  const onChangeSelection = useCallback((selection: CheckboxSelectionState) => {
    const selected = Object.keys(selection).filter((id) => selection[id]);
    // propagates selected values to filter function
    if (selected.length === 0) {
      setFilter(undefined);
    } else {
      setFilter(selected);
    }
  }, []);

  return <Checkbox items={options} onChange={onChangeSelection} />;
};

export const CheckboxFilterRows: FilterType<any> = (
  rows,
  columnIds,
  filterValue: string[]
) => {
  const selected = new Set<string>();

  rows.forEach((row) => {
    columnIds.forEach((id) => {
      if (filterValue.includes(row.values[id])) {
        selected.add(row.id);
      }
    });
  });

  return rows.filter((row) => selected.has(row.id));
};

export default CheckboxFilter;
