import React, { FC } from "react";
import { Grid, GridProps, lighten, Typography, useTheme } from "@mui/material";
import { WithChildren } from "types/common";
import { Button } from "components/base";

interface IEventStepProps {
  title: string;
  handleNext(): void;
  handleNextTitle?: string;
  handlePreviousTitle?: string;
  handlePrevious?(): void;
  active: boolean;
}

const EventStep: FC<WithChildren<IEventStepProps>> = ({
  handleNext,
  handlePrevious,
  handleNextTitle,
  handlePreviousTitle,
  title,
  children,
  active,
}) => {
  const theme = useTheme();

  if (!active) {
    return null;
  }

  return (
    <Grid
      container
      item
      sx={{
        width: "70%",
        borderRadius: "10px",
        padding: theme.spacing(2, 3),
        backgroundColor: "common.white",
        boxShadow: 2,
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Grid item>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "common.black" }}
        >
          {title}
        </Typography>
      </Grid>
      {children}
      <Grid container item justifyContent="space-between" sx={{ mt: 1.5 }}>
        <Grid item>
          {handlePrevious && (
            <Button
              onClick={handlePrevious}
              sx={{
                backgroundColor: theme.palette.common.black,
                ":hover": {
                  backgroundColor: lighten(theme.palette.common.black, 0.1),
                },
              }}
              textProps={{
                sx: {
                  color: "common.white",
                },
              }}
            >
              {handlePreviousTitle ?? "Previous"}
            </Button>
          )}
        </Grid>
        <Grid item>
          <Button
            sx={{
              backgroundColor: theme.palette.common.black,
              ":hover": {
                backgroundColor: lighten(theme.palette.common.black, 0.1),
              },
            }}
            onClick={handleNext}
            textProps={{
              sx: {
                color: "common.white",
              },
            }}
          >
            {handleNextTitle ?? "Next"}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EventStep;
