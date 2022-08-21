import React, { forwardRef } from "react";
import { SnackbarContent, CustomContentProps, SnackbarKey } from "notistack";
import { Grid, GridProps, useTheme } from "@mui/material";

type BaseSnackbarProps = CustomContentProps & {
  baseProps?: GridProps;
  children: (props: {
    id: SnackbarKey;
    message: string | undefined;
  }) => React.ReactNode;
};

const BaseSnackbar = forwardRef<HTMLDivElement, BaseSnackbarProps>(
  (props, ref) => {
    const { id, message, children, baseProps, ...other } = props;

    const theme = useTheme();

    return (
      <SnackbarContent ref={ref} {...other} role={"alert"}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          {...baseProps}
          sx={{
            background: theme.palette.gradient.angled.main,
            borderRadius: "5px",
            px: 1.2,
            py: 1,
            ...baseProps?.sx,
          }}
        >
          {children({ id, message })}
        </Grid>
      </SnackbarContent>
    );
  }
);
BaseSnackbar.displayName = "BaseSnackbar";

export default BaseSnackbar;
