import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  ControlledInput,
  ControlledSelect,
  LabelledSelect,
} from "components/base";
import LabelledEventInput from "components/event/forms/LabelledEventInput";
import { Grid } from "@mui/material";
import LabelledEventSelect from "components/event/forms/LabelledEventSelect";
import { EventType } from "types/api";

interface IDetailFormProps {
  onSelectWorkshop(isWorkshop: boolean): void;
}

const locationItems = [
  { value: "Location1", display: "Location 1" },
  { value: "Location2", display: "Location 2" },
];

const eventTypeItems = [
  { value: EventType.FOOD, display: "Food" },
  { value: EventType.ACTIVITY, display: "Event" },
  { value: EventType.WORKSHOP, display: "Workshop" },
];

const DetailForm: FC<IDetailFormProps> = ({ onSelectWorkshop }) => {
  const { watch } = useForm();
  const eventType = watch("type");

  // useEffect(() => {
  //   onSelectWorkshop(eventType === "workshop");
  // }, [eventType, onSelectWorkshop]);

  return (
    <Grid container rowGap={3}>
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
          items={eventTypeItems}
          name="type"
          placeholder="Select a type"
          id="type"
          label="Type"
          as={LabelledEventSelect}
        />
      </Grid>
      <Grid item xs={4}>
        <ControlledInput
          name="date"
          placeholder="Select Date"
          id="date"
          label="Date"
          as={LabelledEventInput}
        />
      </Grid>
    </Grid>
  );
};

export default DetailForm;
