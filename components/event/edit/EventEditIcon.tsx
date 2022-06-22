import React, { FC, useCallback } from "react";
import EventEdit from "./EventEdit";
import { Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ControlledDropzone, DropzonePlaceholder } from "components/base";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";

const EventEditIcon: FC = () => {
  const { getValues, watch } = useFormContext();

  const getImageSrc = useCallback(() => {
    const image: File[] | undefined = getValues("eventIcon");

    if (image && image.length > 0) {
      return URL.createObjectURL(image[0]);
    }

    return "";
  }, [getValues]);

  return (
    <EventEdit title={"Event Icon"}>
      <Grid container item flexDirection="column">
        {watch("eventIcon", []).length > 0 && (
          <Grid item>
            <img src={getImageSrc()} width={"100%"} height="100%" />
          </Grid>
        )}
        <Grid item>
          <ControlledDropzone
            name={"eventIcon"}
            replace
            maxFiles={1}
            multiple={false}
            custom
          >
            {watch("eventIcon", []).length > 0 ? (
              <EventDropzoneItem name={"eventIcon"} />
            ) : (
              <DropzonePlaceholder />
            )}
          </ControlledDropzone>
        </Grid>
      </Grid>
    </EventEdit>
  );
};

export default EventEditIcon;
