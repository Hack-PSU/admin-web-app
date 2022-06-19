import React, { FC, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { Grid } from "@mui/material";

interface IEventImageReviewProps {
  name: string;
}

const EventImageReview: FC<IEventImageReviewProps> = ({ name }) => {
  const { getValues } = useFormContext();

  const getImageURL = useCallback(() => {
    const image: File[] = getValues(name);

    if (image) {
      return URL.createObjectURL(image[0]);
    }
    return "";
  }, [getValues, name]);

  return (
    <>
      <Grid item xs={12}>
        {getImageURL() ? (
          <Image src={getImageURL()} alt={`event-image-${name}`} />
        ) : null}
      </Grid>
    </>
  );
};

export default EventImageReview;
