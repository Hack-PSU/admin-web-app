import React, { FC, useCallback } from "react";
import Image from "next/image";
import { Box, Grid } from "@mui/material";
import { useEventStore } from "common/store";

interface IEventImageReviewProps {
  name: "eventImage" | "eventIcon";
}

const EventImageReview: FC<IEventImageReviewProps> = ({ name }) => {
  const event = useEventStore();

  const getImageURL = useCallback(() => {
    const image = event[name];

    if (image) {
      return URL.createObjectURL(image);
    }
    return "";
  }, [event, name]);

  return (
    <>
      <Grid item xs={12}>
        {getImageURL() ? (
          // required to enforce full width and height
          // eslint-disable-next-line @next/next/no-img-element
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
