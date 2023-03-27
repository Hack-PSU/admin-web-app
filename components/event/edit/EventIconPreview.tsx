import { FC, useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import EventEdit from "./EventEdit";
import { Grid } from "@mui/material";

const EventIconPreview: FC = () => {
  const { watch, getValues } = useFormContext();

  const imgRef = useRef<HTMLImageElement>(null);

  const getImageUrl = useCallback((image: File) => {
    const fr = new FileReader();
    fr.onload = (event) => {
      if (
        imgRef.current !== null &&
        event.target !== null &&
        typeof event.target.result === "string"
      ) {
        imgRef.current.src = event.target.result;
      }
    };
    fr.readAsDataURL(image);
  }, []);

  useEffect(() => {
    return watch((value, { name }) => {
      if (name === "icon") {
        if (value["icon"].length > 0) {
          getImageUrl(value["icon"][0]);
        } else if (value["icon"].length === 0) {
          if (imgRef.current !== null) {
            imgRef.current.src = value["iconUrl"];
          }
        }
      }
    }).unsubscribe;
  }, [watch, getValues, getImageUrl]);

  useEffect(() => {
    if (imgRef.current !== null && getValues("icon").length === 0) {
      imgRef.current.src = getValues("iconUrl") ?? "";
    } else if (getValues("icon").length > 0) {
      getImageUrl(getValues("icon")[0]);
    }
  }, [getImageUrl, getValues]);

  return (
    <EventEdit title={"Event Icon Preview"}>
      <Grid item>
        <img ref={imgRef} width={"100%"} height={"100%"} />
      </Grid>
    </EventEdit>
  );
};

export default EventIconPreview;
