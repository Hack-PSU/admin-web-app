import React, { FC, useCallback, useEffect, useState } from "react";
import { useTableContext } from "../Table";
import {
  Box,
  darken,
  Grid,
  IconButton,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { Button, EvaIcon, Input } from "components/base";

interface IPaginationButtonProps {
  onClick(): void;
  icon: string;
  sx: SxProps<Theme>;
  active: boolean;
}

const PaginationButton: FC<IPaginationButtonProps> = ({
  onClick,
  icon,
  sx,
  active,
}) => {
  const theme = useTheme();

  return (
    <IconButton
      disableRipple
      onClick={onClick}
      sx={{
        background: active
          ? theme.palette.gradient.angled.main
          : theme.palette.border.light,
        borderRadius: "5px",
        padding: theme.spacing(0),
        transition: "background-color 200ms ease-in-out",
        lineHeight: "1.5rem",
        width: "35px",
        height: "35px",
        ":hover": {
          backgroundColor: darken(theme.palette.button.light, 0.03),
        },
        ...sx,
      }}
    >
      <Box mt={0.5}>
        <EvaIcon
          name={icon}
          fill={
            active ? theme.palette.common.white : theme.palette.common.black
          }
          size={"xlarge"}
          style={{ height: "auto" }}
        />
      </Box>
    </IconButton>
  );
};

export const PaginationAction: FC = () => {
  const {
    getState,
    getPageCount,
    previousPage,
    nextPage,
    setPageIndex,
    getCanNextPage,
    getCanPreviousPage,
  } = useTableContext();
  const {
    pagination: { pageIndex },
  } = getState();

  const theme = useTheme();
  const [page, setPage] = useState<string>(String(pageIndex + 1));

  useEffect(() => {
    if (pageIndex >= 0 && pageIndex < getPageCount()) {
      setPage(String(pageIndex + 1));
    }
  }, [pageIndex, getPageCount]);

  const onChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPage(event.target.value);
      setPageIndex(parseInt(event.target.value) - 1);
    },
    [setPage, setPageIndex]
  );

  const onClickNext = useCallback(() => {
    if (getCanNextPage()) {
      nextPage();
    }
  }, [getCanNextPage, nextPage]);

  const onClickPrev = useCallback(() => {
    if (getCanPreviousPage()) {
      previousPage();
    }
  }, [getCanPreviousPage, previousPage]);

  return (
    <Grid container item justifyContent="center" xs={5.5} alignItems="center">
      <Grid item xs={2}>
        <PaginationButton
          onClick={onClickPrev}
          icon={"chevron-left-outline"}
          sx={{ ml: "auto" }}
          active={getCanPreviousPage()}
        />
      </Grid>
      <Grid
        xs={8}
        container
        item
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Grid item>
          <Input
            placeholder={""}
            value={page}
            sx={{
              width: "35px",
              height: "35px",
              padding: theme.spacing(0.2),
              borderRadius: "5px",
            }}
            inputProps={{
              sx: {
                fontSize: "1.0625rem",
                textAlign: "center",
              },
            }}
            onChange={onChangeInput}
          />
        </Grid>
        <Grid item>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: theme.typography.pxToRem(17),
            }}
          >
            of
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: theme.typography.pxToRem(17),
            }}
          >
            {getPageCount()}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <PaginationButton
          onClick={onClickNext}
          icon={"chevron-right-outline"}
          sx={{ mr: "auto" }}
          active={getCanNextPage()}
        />
      </Grid>
    </Grid>
  );
};

export const DeleteAction: FC<{ onDelete(): void }> = ({ onDelete }) => {
  const theme = useTheme();
  const [hover, setHover] = useState<boolean>(false);

  return (
    <Grid item xs={6} justifyContent={"flex-end"}>
      <Button
        startIcon={
          <Box mt={0.5}>
            <EvaIcon
              name={"trash-outline"}
              size={"medium"}
              fill={
                hover ? theme.palette.common.white : theme.palette.error.main
              }
            />
          </Box>
        }
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          lineHeight: "1.5rem",
          padding: theme.spacing(0.2, 2),
          borderRadius: "10px",
          alignItems: "center",
          backgroundColor: "common.white",
          border: `2px solid ${theme.palette.error.main}`,
          transition: "all 200ms ease-in-out",
          width: "100%",
          ":hover": {
            backgroundColor: "error.main",
          },
        }}
        textProps={{
          sx: {
            color: hover ? "common.white" : "error.main",
            fontSize: theme.typography.pxToRem(14),
          },
        }}
        onClick={onDelete}
      >
        Delete
      </Button>
    </Grid>
  );
};
