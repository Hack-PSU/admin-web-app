import React, { FC } from "react";
import EventEdit from "./EventEdit";
import { Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ControlledDropzone, DropzonePlaceholder } from "components/base";
import EventDropzoneItem from "components/event/forms/EventDropzoneItem";

const EventEditIcon: FC = () => {
  const { watch } = useFormContext();

  return (
    <EventEdit title={"Event Icon"}>
      <Grid item>
        <ControlledDropzone
          name={"icon"}
          replace
          maxFiles={1}
          multiple={false}
          custom
        >
          {watch("icon", []).length > 0 ? (
            <EventDropzoneItem name={"icon"} />
          ) : (
            <DropzonePlaceholder />
          )}
        </ControlledDropzone>
      </Grid>
    </EventEdit>
  );
};

export default EventEditIcon;
