import React, { FC, useCallback } from "react";
import { Grid } from "@mui/material";
import { useEventStore } from "common/store";

const EventImageReview: FC = () => {
  const { icon } = useEventStore();

  const getImageURL = useCallback(() => {
    if (icon) {
      return URL.createObjectURL(icon);
    }
    return "";
  }, [icon]);

  return (
    <>
      <Grid item xs={12}>
        {getImageURL() ? (
          <img
            src={getImageURL()}
            alt={`event-image-${name}`}
            width="100%"
            height="100%"
          />
        ) : null}
      </Grid>
    </>
  );
};

export default EventImageReview;
