import React, { FC, useState } from "react";
import { EvaIcon, Input } from "components/base";
import { IInputProps } from "types/components";
import {
  useAsyncDebounce,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from "react-table";
import { Box, InputAdornment, useTheme } from "@mui/material";

interface IGlobalFilterProps extends IInputProps {
  setGlobalFilter: UseGlobalFiltersInstanceProps<object>["setGlobalFilter"];
  globalFilter: UseGlobalFiltersState<object>["globalFilter"];
}

const GlobalFilter: FC<IGlobalFilterProps> = ({
  setGlobalFilter,
  globalFilter,
  ...props
}) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  const theme = useTheme();

  return (
    <Input
      {...props}
      startAdornment={
        <InputAdornment position={"start"}>
          <Box mt={0.5}>
            <EvaIcon
              name={"search-outline"}
              size="medium"
              fill={theme.palette.common.black}
            />
          </Box>
        </InputAdornment>
      }
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onChange(event.target.value);
      }}
      sx={{
        width: "100%",
        borderRadius: "15px",
        backgroundColor: "common.white",
        lineHeight: "1.5rem",
        padding: theme.spacing(0.5, 1.3),
        ...props.sx,
      }}
      inputProps={{
        sx: {
          fontSize: theme.typography.pxToRem(14),
        },
      }}
    />
  );
};

export default GlobalFilter;
