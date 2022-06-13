import React, { FC } from "react";
import {
  ControlledInput,
  ControlledSelect,
  ControlledDropzone,
  DropzoneItem,
  LabelledDropzone,
} from "components/base";
import LabelledEventInput from "../LabelledEventInput";
import { alpha, Grid, Typography } from "@mui/material";
import LabelledEventSelect from "../LabelledEventSelect";
import { EventType } from "types/api";
import DateTimeForm from "./DateTimeForm";
import { useFormContext } from "react-hook-form";
import produce from "immer";
import { ISelectItem } from "types/components";
import EventLocationSelect from "components/event/forms/EventLocationSelect";

const locationItems: ISelectItem[] = [
  { value: "Location1", display: "Location 1" },
  { value: "Location2", display: "Location 2" },
  { value: "AddLocation", type: "button", display: "Add New Location" },
];

const eventTypeItems = [
  { value: EventType.FOOD, display: "Food" },
  { value: EventType.ACTIVITY, display: "Event" },
  { value: EventType.WORKSHOP, display: "Workshop" },
];

const DetailsForm: FC = () => {
  const { getValues, setValue, watch } = useFormContext();
  const images = watch("images");

  const onRemoveItem = (index: number) => {
    setValue(
      "images",
      produce(getValues("images"), (draft: File[]) => {
        draft.splice(index, 1);
      })
    );
  };

  return (
    <Grid
      container
      sx={{ width: "100%", flexWrap: "wrap" }}
      rowGap={3}
      justifyContent="space-between"
      columnSpacing={2}
    >
      <Grid item xs={12}>
        <ControlledInput
          name="name"
          placeholder="Enter event name"
          as={LabelledEventInput}
          label={"Name"}
          id="name"
        />
      </Grid>
      <Grid item xs={6}>
        <ControlledSelect
          items={locationItems}
          name="location"
          placeholder="Select a location"
          id="location"
          label="Location"
          as={EventLocationSelect}
        />
      </Grid>
      <Grid item xs={6}>
        <ControlledSelect
          items={eventTypeItems}
          name="type"
          placeholder="Select a type"
          id="type"
          label="Type"
          as={LabelledEventSelect}
        />
      </Grid>
      <DateTimeForm />
      <Grid item xs={12}>
        <ControlledInput
          name="description"
          placeholder={"Enter a description"}
          id="description"
          label={"Description"}
          multiline
          fullWidth
          as={LabelledEventInput}
          rows={3}
        />
      </Grid>
      <Grid container item xs={12} gap={3}>
        <Grid item xs={7}>
          <ControlledDropzone
            name="images"
            id="images"
            label="Image"
            as={LabelledDropzone}
            containerStyle={{
              mt: 0.6,
            }}
          />
        </Grid>
        <Grid item xs={4} pt={1.5}>
          {(images ?? []).map((image: File, index: number) => (
            <DropzoneItem
              onRemove={onRemoveItem}
              file={image}
              index={index}
              key={`${image.name}-${index}`}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DetailsForm;
