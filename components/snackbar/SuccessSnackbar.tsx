import React, { forwardRef } from "react";
import { CustomContentProps, useSnackbar } from "notistack";
import BaseSnackbar from "components/snackbar/BaseSnackbar";
import { Grid, IconButton, Typography, useTheme } from "@mui/material";
import { EvaIcon } from "components/base";

const SuccessSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  (props, ref) => {
    const theme = useTheme();
    const { closeSnackbar } = useSnackbar();

    return (
      <BaseSnackbar
        {...props}
        ref={ref}
        baseProps={{
          sx: { background: undefined, backgroundColor: "success.main" },
        }}
      >
        {({ id, message }) => (
          <>
            <Grid
              container
              item
              xs={10}
              alignItems={"center"}
              columnSpacing={1}
              flexWrap={"nowrap"}
            >
              <Grid item pt={0.3}>
                <EvaIcon
                  name={"checkmark-circle-2"}
                  fill={theme.palette.common.white}
                  size={"large"}
                />
              </Grid>
              <Grid item>
                <Typography
                  variant={"body1"}
                  sx={{
                    color: "common.white",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  {message}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton
                onClick={() => closeSnackbar(id)}
                sx={{
                  width: "30px",
                  height: "30px",
                  pt: 1.5,
                }}
              >
                <EvaIcon name={"close"} fill={"white"} size={"large"} />
              </IconButton>
            </Grid>
          </>
        )}
      </BaseSnackbar>
    );
  }
);
SuccessSnackbar.displayName = "SuccessSnackbar";

export default SuccessSnackbar;
