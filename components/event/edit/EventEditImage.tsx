import React, { FC, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import EventEdit from "./EventEdit";
import { Grid } from "@mui/material";
import { ControlledDropzone, DropzonePlaceholder } from "components/base";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";

const EventEditImage: FC = () => {
  const { getValues, watch } = useFormContext();

  const getImageSrc = useCallback(() => {
    const image: File[] | undefined = getValues("eventImage");

    if (image && image.length > 0) {
      return URL.createObjectURL(image[0]);
    }

    return "";
  }, [getValues]);

  return (
    <EventEdit title={"Event Image"}>
      <Grid container item flexDirection="column">
        {watch("eventImage", [])?.length > 0 && (
          <Grid item>
            <img src={getImageSrc()} width="100%" height="100%" />/
          </Grid>
        )}
        <Grid item>
          <ControlledDropzone
            name={"eventImage"}
            multiple={false}
            maxFiles={1}
            custom
            replace
          >
            {watch("eventImage", []).length > 0 ? (
              <EventDropzoneItem name={"eventImage"} />
            ) : (
              <DropzonePlaceholder />
            )}
          </ControlledDropzone>
        </Grid>
      </Grid>
    </EventEdit>
  );
};

export default EventEditImage;
