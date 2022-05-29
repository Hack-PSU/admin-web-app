import { FC, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  ControlledInput,
  ControlledSelect,
  LabelledInput,
} from "components/base";
import LabelledEventInput from "components/event/forms/LabelledEventInput";
import { Grid } from "@mui/material";
import LabelledEventSelect from "components/event/forms/LabelledEventSelect";

interface IDetailFormProps {
  onSelectWorkshop(isWorkshop: boolean): void;
}

const locationItems = [
  { value: "Location1", display: "Location 1" },
  { value: "Location2", display: "Location 2" },
];

const DetailForm: FC<IDetailFormProps> = ({ onSelectWorkshop }) => {
  const { watch } = useForm();
  const eventType = watch("type");

  // useEffect(() => {
  //   onSelectWorkshop(eventType === "workshop");
  // }, [eventType, onSelectWorkshop]);

  return (
    <Grid container>
      <Grid item xs={4}>
        <ControlledInput
          name="name"
          placeholder="Enter event name"
          as={LabelledEventInput}
          label={"Name"}
          id="name"
        />
      </Grid>
      <Grid item xs={4}>
        <ControlledSelect
          items={locationItems}
          name="location"
          placeholder="Select a location"
          id="location"
          label="Location"
          as={LabelledEventSelect}
        />
      </Grid>
      <Grid item xs={4}>
        <ControlledSelect
          items={locationItems}
          name="type"
          placeholder="Select a type"
          id="type"
          label="Type"
          as={LabelledEventSelect}
        />
      </Grid>
    </Grid>
  );
};

export default DetailForm;
