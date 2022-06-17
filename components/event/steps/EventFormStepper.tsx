import React, { FC } from "react";
import StepperProvider, {
  useStepper,
} from "components/base/Stepper/StepperProvider";
import Stepper from "components/base/Stepper/Stepper";
import { Grid } from "@mui/material";

const Inside: FC = () => {
  const {} = useStepper({ step: 0, label: "Number 1" });

  return <Grid container item sx={{ backgroundColor: "black" }}></Grid>;
};

const Inside2: FC = () => {
  const {} = useStepper({ step: 1, label: "Number 2", optional: true });

  return <Grid container item sx={{ backgroundColor: "black" }}></Grid>;
};

const EventFormStepper: FC = () => {
  return (
    <StepperProvider>
      <Stepper />
      <Inside />
      <Inside2 />
    </StepperProvider>
  );
};

export default EventFormStepper;
