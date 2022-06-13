import React, { FC, useCallback, useEffect, useState } from "react";
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
import { EvaIcon, Input } from "components/base";
import { UsePaginationInstanceProps } from "react-table";

interface IPaginationActionProps {
  nextPage(): void;
  previousPage(): void;
  gotoPage: UsePaginationInstanceProps<object>["gotoPage"];
  pageCount: number;
  pageIndex: number;
}

interface IPaginationButtonProps {
  onClick(): void;
  icon: string;
  sx: SxProps<Theme>;
}

const PaginationButton: FC<IPaginationButtonProps> = ({
  onClick,
  icon,
  sx,
}) => {
  const theme = useTheme();

  return (
    <IconButton
      disableRipple
      onClick={onClick}
      sx={{
        backgroundColor: "button.grey",
        // height: "100%",
        // width: "100%",
        borderRadius: "5px",
        padding: theme.spacing(0),
        transition: "background-color 200ms ease-in-out",
        lineHeight: "1.5rem",
        width: "35px",
        height: "35px",
        ":hover": {
          backgroundColor: darken(theme.palette.button.grey, 0.03),
        },
        ...sx,
      }}
    >
      <Box mt={0.5}>
        <EvaIcon
          name={icon}
          fill={theme.palette.common.black}
          size="xlarge"
          style={{ height: "auto" }}
        />
      </Box>
    </IconButton>
  );
};

const PaginationAction: FC<IPaginationActionProps> = ({
  nextPage,
  previousPage,
  gotoPage,
  pageCount,
  pageIndex,
}) => {
  const [page, setPage] = useState<string>(String(pageIndex + 1));

  const theme = useTheme();

  useEffect(() => {
    if (pageIndex >= 0 && pageIndex < pageCount) {
      setPage(String(pageIndex + 1));
    }
  }, [pageIndex, pageCount]);

  const onChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPage(event.target.value);
      gotoPage(parseInt(event.target.value) - 1);
    },
    [setPage, gotoPage]
  );

  const onClickNext = useCallback(() => {
    if (pageIndex + 1 < pageCount) {
      nextPage();
    }
  }, [nextPage, pageIndex, pageCount]);

  const onClickPrev = useCallback(() => {
    if (pageIndex > 0) {
      previousPage();
    }
  }, [previousPage, pageIndex]);

  return (
    <Grid container item justifyContent="center" xs={5.5} alignItems="center">
      <Grid item xs={2}>
        <PaginationButton
          sx={{ ml: "auto" }}
          onClick={onClickPrev}
          icon={"chevron-left-outline"}
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
              padding: theme.spacing(0.2, 0.2),
              height: "35px",
              borderRadius: "5px",
            }}
            inputProps={{
              sx: {
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
            {pageCount}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <PaginationButton
          sx={{ mr: "auto" }}
          onClick={onClickNext}
          icon={"chevron-right-outline"}
        />
      </Grid>
    </Grid>
  );
};

export default PaginationAction;
