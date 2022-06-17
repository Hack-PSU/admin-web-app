import React, { FC, useCallback, useState } from "react";
import {
  Stepper as MuiStepper,
  StepConnector,
  stepConnectorClasses,
  styled,
  Step,
  StepLabel,
  StepIconProps,
  Box,
  useTheme,
} from "@mui/material";
import { WithControllerProps } from "types/components";
import { WithChildren } from "types/common";
import { IStepItem } from "./types";
import { useStepperContext } from "components/base/Stepper/StepperProvider";
import _ from "lodash";

const StyledConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 8,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.gradient.angled.accent,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: theme.palette.gradient.angled.accent,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.border.dark,
    borderRadius: 1,
  },
}));

const StyledStepIcon = styled("div")(({ theme }) => ({
  display: "flex",
  // width: 20,
  // height: 20,
  alignItems: "center",
  justifyContent: "center",
  // backgroundColor: theme.palette.border.dark,
  // borderRadius: "50%"
}));

const StepIconRoot: FC<StepIconProps> = ({ active, completed }) => {
  const theme = useTheme();

  return (
    <StyledStepIcon>
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background:
            active || completed
              ? theme.palette.gradient.angled.accent
              : theme.palette.border.dark,
        }}
      />
    </StyledStepIcon>
  );
};

const Stepper: FC = () => {
  const { steps, skipped, activeStep } = useStepperContext();

  const isStepSkipped = (step: number) => skipped[String(step)];

  const getOrderedSteps = useCallback(() => {
    return _.chain(steps)
      .entries()
      .sortBy((entry) => entry[0])
      .map((value) => value[1])
      .value();
  }, [steps]);

  return (
    <MuiStepper activeStep={1} connector={<StyledConnector />} alternativeLabel>
      {getOrderedSteps().map((step, index) => {
        const stepProps: { completed?: boolean } = {};

        if (isStepSkipped(index)) {
          stepProps.completed = false;
        } else {
          stepProps.completed = activeStep >= index;
        }

        return (
          <Step key={step.label} {...stepProps}>
            <StepLabel StepIconComponent={StepIconRoot}>{step.label}</StepLabel>
          </Step>
        );
      })}
    </MuiStepper>
  );
};

export default Stepper;
