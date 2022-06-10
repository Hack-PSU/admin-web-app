import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AddColumnConfig,
  AddConfigOptions,
  BuilderCallback,
  ColumnBuilder,
  ColumnOptions,
  ColumnState,
  FilterOptions,
  PaginatedQueryFn,
  TableColumnBuilder,
  TableColumnBuilderConfig,
  UseApiQueryReturn,
  UseClipboardReturn,
  UseDateTime,
  UseDateTimeRange,
  UsePaginatedQuery,
  UsePaginatedQueryOptions,
} from "types/hooks";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import produce from "immer";
import _ from "lodash";
import { AxiosResponse } from "axios";
import { ApiResponse } from "types/api";
import {
  CheckboxFilter,
  CheckboxFilterRows,
  InputFilter,
  InputFilterRows,
} from "components/Table/filters";

export function useQueryResolver<
  TData,
  TQuery = AxiosResponse<ApiResponse<TData>>
>(queryFn: () => Promise<TQuery | undefined>): UseApiQueryReturn<TData> {
  return {
    async request(...params: any[]) {
      const resp: any = await queryFn.bind(params)();
      if (resp && resp.data) {
        return resp.data.body.data;
      }
    },
  };
}

export function usePaginatedQuery<
  TData,
  TRequest = AxiosResponse<ApiResponse<TData>>
>(
  queryFn: PaginatedQueryFn<TRequest>,
  { page: initialPage = 1, limit }: UsePaginatedQueryOptions
): UsePaginatedQuery<TData> {
  // const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(initialPage);
  //
  // useEffect(() => {
  //   console.log(page, limit);
  //   setOffset((page - 1) * limit);
  // }, [limit, page]);

  const handlePageChange = useCallback((page: number) => {
    console.log(page);
    setPage(page);
  }, []);

  const request = useCallback(
    async (page: number) => {
      const offset = (page - 1) * limit;
      const resp = await queryFn(offset, limit);
      // @ts-ignore
      if (resp && resp.data) {
        // @ts-ignore
        return resp.data.body.data;
      }
    },
    [queryFn, limit]
  );

  return {
    request,
    limit,
    handlePageChange,
    page,
  };
}

export function useDateTime(name: string, methods: UseFormReturn): UseDateTime {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(
    DateTime.fromFormat("01:00 AM", "hh:mm a").toJSDate()
  );

  const formatDate = useCallback(() => {
    return DateTime.fromJSDate(date).set({
      hour: time.getHours(),
      minute: time.getMinutes(),
    });
  }, [date, time]);

  useEffect(() => {
    methods.setValue(name, formatDate().toJSDate());
  }, [name, date, time, methods, formatDate]);

  return <UseDateTime>{
    dateTime: formatDate().toJSDate(),
    register(type) {
      if (type === "date") {
        return {
          value: date,
          onChange: setDate,
        };
      } else if (type === "time") {
        return {
          value: time,
          onChange: setTime,
        };
      }
    },
  };
}

export function useDateTimeRange(
  name: string
  // startDateName: string,
  // endDateName: string,
): UseDateTimeRange {
  const { setValue, register } = useFormContext();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(
    DateTime.fromFormat("01:00 AM", "hh:mm a").toJSDate()
  );

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(
    DateTime.fromFormat("01:00 AM", "hh:mm a").toJSDate()
  );

  const [isMultipleDays, setIsMultipleDays] = useState<boolean>(false);

  const formatDate = useCallback((date: Date, time: Date) => {
    return DateTime.fromJSDate(date)
      .set({
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: 0,
        millisecond: 0,
      })
      .toJSDate();
  }, []);

  const getValue = useCallback(() => {
    return [
      formatDate(startDate, startTime),
      formatDate(isMultipleDays ? endDate : startDate, endTime),
    ];
  }, [isMultipleDays, formatDate, startDate, startTime, endDate, endTime]);

  useEffect(() => {
    register(`${name}.start`);
    register(`${name}.end`);
  }, [register, name]);

  useEffect(() => {
    const startDateTime = getValue()[0];
    setValue(`${name}.start`, startDateTime);
  }, [name, getValue, setValue, startDate, startTime]);

  useEffect(() => {
    const endDateTime = getValue()[1];
    setValue(`${name}.end`, endDateTime);
  }, [name, getValue, endDate, endTime, setValue]);

  const toggleMultiple = useCallback(() => {
    setIsMultipleDays((multiple) => !multiple);
  }, []);

  return {
    register(type) {
      switch (type) {
        case "startDate":
          return {
            value: startDate,
            onChange: setStartDate,
          };
        case "startTime":
          return {
            value: startTime,
            onChange: setStartTime,
          };
        case "endDate":
          return {
            value: endDate,
            onChange: setEndDate,
          };
        case "endTime":
          return {
            value: endTime,
            onChange: setEndTime,
          };
      }
    },
    startDateTime: getValue()[0],
    endDateTime: getValue()[1],
    toggleMultiple,
    isMultipleDays,
  };
}

const _builder: TableColumnBuilderConfig = <T extends object>(
  state: ColumnState<T>
) => ({
  addColumn(name: string, options: ColumnOptions): TableColumnBuilder<T> {
    const id = nanoid(10);
    const { hideHeader, type, filterOption, ...rest } = options;

    let configOptions: AddConfigOptions = {
      id,
      name,
      defaultCanFilter: true,
      type,
      ...(hideHeader ? {} : { Header: name, accessor: _.camelCase(name) }),
    };

    if (filterOption) {
      configOptions = {
        ...configOptions,
        ...getFilterByType(filterOption.type),
      };
    }

    return _addColumn(state, {
      ...configOptions,
      ...rest,
    });
  },
  save(): ColumnState<T> {
    return state;
  },
});

const _addColumn: AddColumnConfig = (state, options) => {
  return _builder(
    produce(state, (draft) => {
      const { name, type, ...rest } = options;
      // @ts-ignore
      draft.columns.push({ ...rest });
      /// @ts-ignore
      draft.names.push({
        name,
        type,
      });
    })
  );
};

const getFilterByType = (type: FilterOptions["type"]) => {
  switch (type) {
    case "checkbox":
      return {
        Filter: CheckboxFilter,
        filter: CheckboxFilterRows,
      };
    case "input":
      return {
        Filter: InputFilter,
        filter: InputFilterRows,
      };
    case "date":
      break;
    case "time":
      break;
    case "hide":
      return null;
  }
};

export function useColumnBuilder<T extends object>(
  builder: BuilderCallback<T>
): ColumnState<T> {
  return useMemo(
    () =>
      (
        builder(_builder({ columns: [], names: [] })) as ColumnBuilder<T>
      ).save(),
    [builder]
  );
}

export function useClipboard(): UseClipboardReturn {
  return {
    onClickToCopy(value) {
      void navigator.clipboard.writeText(value);
    },
  };
}
