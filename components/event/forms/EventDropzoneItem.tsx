import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Grid, IconButton, Typography, useTheme } from "@mui/material";
import { EvaIcon } from "components/base";

const EventDropzoneItem: FC = () => {
  const { watch, resetField } = useFormContext();
  const eventImage: File[] = watch("eventImage", []);

  const theme = useTheme();

  const onRemoveImage = (event: React.MouseEvent) => {
    event.stopPropagation();
    resetField("eventImage");
  };

  return (
    <Grid
      container
      item
      flexDirection="column"
      sx={{
        borderRadius: "15px",
        padding: theme.spacing(2, 3),
        width: "80%",
        height: "90%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "common.white",
        boxShadow: 2,
      }}
      gap={1}
    >
      <Grid container item justifyContent="space-between" alignItems="center">
        <Grid item xs={1}>
          <EvaIcon
            name={"image"}
            fill={theme.palette.common.black}
            size="xlarge"
          />
        </Grid>
        <Grid container item flexDirection={"column"} xs={10}>
          <Grid item>
            <Typography
              variant="body1"
              sx={{
                color: "common.black",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {eventImage[0].name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="subtitle1"
              sx={{ color: "border.dark", fontSize: "0.7rem" }}
            >
              {Math.round(eventImage[0].size / 1000)}KB
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            onClick={onRemoveImage}
            sx={{
              width: "45px",
              height: "45px",
            }}
          >
            <EvaIcon
              name={"trash-outline"}
              fill={theme.palette.error.main}
              size="large"
            />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EventDropzoneItem;
