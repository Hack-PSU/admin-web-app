import "@mui/material/styles";
import {
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseRowStateCellProps,
  UseRowStateInstanceProps,
  UseRowStateOptions,
  UseRowStateRowProps,
  UseRowStateState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from "react-table";
import { TypeBackground as MuiTypeBackground } from "@mui/material";

declare module "@mui/material/styles" {
  /* eslint-disable-next-line */ // Palette is an interface from @mui
  interface Palette {
    menu: {
      main: string;
      accent: string;
      line: string;
    };
    gradient: {
      angled: {
        main: string;
        accent: string;
      };
    };
    sunset: {
      light: string;
      dark: string;
    };
    border: {
      light: string;
      dark: string;
    };
    select: {
      main: string;
      placeholder: string;
    };
    input: {
      border: string;
    };
    button: {
      grey: string;
    };
    table: {
      header: string;
      divider: string;
      border: string;
    };
  }

  /* eslint-disable-next-line */ // PaletteOptions is an interface from @mui
  interface PaletteOptions {
    menu?: {
      main?: string;
      accent?: string;
      line?: string;
    };
    gradient?: {
      angled?: {
        main?: string;
        accent?: string;
      };
    };
    sunset?: {
      light?: string;
      dark?: string;
    };
    border?: {
      light?: string;
      dark?: string;
    };
    select?: {
      main?: string;
      placeholder?: string;
    };
    input?: {
      border?: string;
    };
    button?: {
      grey?: string;
    };
    table?: {
      header?: string;
      divider?: string;
      border?: string;
    };
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface TypeBackground extends MuiTypeBackground {
    light: string;
    dark: string;
  }
}

/* https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-table/Readme.md */
declare module "react-table" {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  /* eslint-disable-next-line */
  export interface TableOptions<
    T extends Record<string, unknown>
  > extends UseExpandedOptions<T>,
      UseFiltersOptions<T>,
      UseGlobalFiltersOptions<T>,
      UseGroupByOptions<T>,
      UsePaginationOptions<T>,
      UseResizeColumnsOptions<T>,
      UseRowSelectOptions<T>,
      UseRowStateOptions<T>,
      UseSortByOptions<T>,
      // note that having Record here allows you to add anything to the options, this matches the spirit of the
      // underlying js library, but might be cleaner if it's replaced by a more specific type that matches your
      // feature set, this is a safe default.
      Record<string, any> {}

  /* eslint-disable-next-line */
  export interface Hooks<
    T extends Record<string, unknown> = Record<string, unknown>
  > extends UseExpandedHooks<T>,
      UseGroupByHooks<T>,
      UseRowSelectHooks<T>,
      UseSortByHooks<T> {}

  /* eslint-disable-next-line */
  export interface TableInstance<
    T extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderInstanceProps<T>,
      UseExpandedInstanceProps<T>,
      UseFiltersInstanceProps<T>,
      UseGlobalFiltersInstanceProps<T>,
      UseGroupByInstanceProps<T>,
      UsePaginationInstanceProps<T>,
      UseRowSelectInstanceProps<T>,
      UseRowStateInstanceProps<T>,
      UseSortByInstanceProps<T> {}

  /* eslint-disable-next-line */
  export interface TableState<
    T extends Record<string, unknown> = Record<string, unknown>
  > extends UseColumnOrderState<T>,
      UseExpandedState<T>,
      UseFiltersState<T>,
      UseGlobalFiltersState<T>,
      UseGroupByState<T>,
      UsePaginationState<T>,
      UseResizeColumnsState<T>,
      UseRowSelectState<T>,
      UseRowStateState<T>,
      UseSortByState<T> {}

  /* eslint-disable-next-line */
  export interface ColumnInterface<
    T extends Record<string, unknown> = Record<string, unknown>
  > extends UseFiltersColumnOptions<T>,
      UseGlobalFiltersColumnOptions<T>,
      UseGroupByColumnOptions<T>,
      UseResizeColumnsColumnOptions<T>,
      UseSortByColumnOptions<T> {}

  /* eslint-disable-next-line */
  export interface ColumnInstance<
    T extends Record<string, unknown> = Record<string, unknown>
  > extends UseFiltersColumnProps<T>,
      UseGroupByColumnProps<T>,
      UseResizeColumnsColumnProps<T>,
      UseSortByColumnProps<T> {}

  /* eslint-disable-next-line */
  export interface Cell<
    T extends Record<string, unknown> = Record<string, unknown>
  > extends UseGroupByCellProps<T>,
      UseRowStateCellProps<T> {}

  /* eslint-disable-next-line */
  export interface Row<
    T extends Record<string, unknown> = Record<string, unknown>
  > extends UseExpandedRowProps<T>,
      UseGroupByRowProps<T>,
      UseRowSelectRowProps<T>,
      UseRowStateRowProps<T> {}
}
