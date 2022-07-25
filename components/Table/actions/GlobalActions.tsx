import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTableContext } from "../Table";
import { Button, EvaIcon, Input, Select } from "components/base";
import { Box, Grid, InputAdornment, useTheme } from "@mui/material";
import _ from "lodash";
import { SingleValue } from "react-select";
import { IOption } from "types/components";

export const GlobalSearch: FC = () => {
  const {
    setGlobalFilter,
    getState,
    options: { meta },
    getColumn,
  } = useTableContext();
  const { globalFilter } = getState();

  const theme = useTheme();
  const [value, setValue] = useState(globalFilter);

  const placeholder = useMemo(() => {
    const texts = _.chain(meta?.columnType)
      .map((config, columnId) => {
        if (config.type === "text" || config.type === "input") {
          const header = getColumn(columnId).columnDef.header;
          if (typeof header === "string") {
            return _.toLower(header);
          }
          return _.toLower(columnId);
        }
      })
      .value();

    if (texts.length === 1) {
      return `Search by ${texts[texts.length - 1]}`;
    } else if (texts.length === 2) {
      return `Search by ${texts[0]} or ${texts[1]}`;
    }

    const lastText = texts[texts.length - 1];
    texts.splice(texts.length - 1, 1, `or ${lastText}`);

    return `Search by ${texts.join(", ")}`;
  }, [meta?.columnType]);

  useEffect(() => {
    // Debounce setting global filter
    const timeout = setTimeout(() => {
      setGlobalFilter(value ? String(value) : undefined);
    }, 500);

    return () => clearTimeout(timeout);
  }, [setGlobalFilter, value]);

  return (
    <Grid item xs={5}>
      <Input
        startAdornment={
          <InputAdornment position={"start"}>
            <Box mt={0.5}>
              <EvaIcon name={"search-outline"} />
            </Box>
          </InputAdornment>
        }
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        sx={{
          width: "100%",
          py: theme.spacing(0.8),
          backgroundColor: "common.white",
        }}
        placeholder={placeholder}
      />
    </Grid>
  );
};

export const GlobalRefresh: FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const theme = useTheme();

  return (
    <Grid item xs={3} sx={{ height: "100%" }}>
      <Button
        startIcon={
          <Box mt={0.5}>
            <EvaIcon name={"refresh-outline"} />
          </Box>
        }
        sx={{
          lineHeight: "1.5rem",
          padding: theme.spacing(0.5, 2),
          borderRadius: "10px",
          alignItems: "center",
          width: "100%",
          backgroundColor: "common.white",
          boxShadow: 1,
          height: "100%",
        }}
        textProps={{
          sx: {
            fontSize: theme.typography.pxToRem(14),
          },
        }}
        onClick={onRefresh}
      >
        Refresh
      </Button>
    </Grid>
  );
};

export const GlobalPageSize: FC = () => {
  const { setPageSize } = useTableContext();

  const onChangePageSize = useCallback(
    (newValue: SingleValue<IOption>) => {
      if (newValue) {
        setPageSize(Number(newValue.value));
      }
    },
    [setPageSize]
  );

  return (
    <Grid item xs={3}>
      <Select
        options={[
          { value: "4", label: "4 entries" },
          { value: "8", label: "8 entries" },
          { value: "10", label: "10 entries" },
          { value: "20", label: "20 entries" },
        ]}
        name={"limit"}
        defaultValue={{ value: "8", label: "8 entries" }}
        onChange={onChangePageSize}
      />
    </Grid>
  );
};
