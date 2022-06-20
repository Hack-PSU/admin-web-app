import React, { FC, useCallback } from "react";
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
import { useStepperContext } from "components/base/Stepper/StepperProvider";
import _ from "lodash";

type StepIconRootProps = StepIconProps & {
  skipped: boolean;
};

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
    height: 4,
    border: 0,
    backgroundColor: theme.palette.border.dark,
    borderRadius: 2,
  },
}));

const StyledStepIcon = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledStepper = styled(MuiStepper)(({ theme }) => ({
  margin: theme.spacing(5, 0),
}));

const StepIconRoot: FC<StepIconRootProps> = ({
  active,
  completed,
  skipped,
}) => {
  const theme = useTheme();

  const getIconStyle = () => {
    if (skipped) {
      return {
        border: `2px solid ${theme.palette.sunset.dark}`,
        background: theme.palette.border.dark,
      };
    } else if (active || completed) {
      return {
        background: theme.palette.gradient.angled.accent,
      };
    }
    return {
      background: theme.palette.border.dark,
    };
  };

  return (
    <StyledStepIcon>
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          ...getIconStyle(),
        }}
      />
    </StyledStepIcon>
  );
};

const Stepper: FC = () => {
  const { steps, skipped, activeStep } = useStepperContext();

  const isStepSkipped = (step: number) => skipped[String(step)];

  const getOrderedSteps = useCallback(
    () =>
      _.chain(steps)
        .entries()
        .sortBy((entry) => entry[0])
        .map((value) => value[1])
        .value(),
    [steps]
  );

  return (
    <StyledStepper
      activeStep={activeStep}
      connector={<StyledConnector />}
      alternativeLabel
    >
      {getOrderedSteps().map((step, index) => {
        return (
          <Step key={step.label} completed={activeStep >= index}>
            <StepLabel
              StepIconComponent={(props) => (
                <StepIconRoot {...props} skipped={isStepSkipped(index)} />
              )}
            >
              {step.label}
            </StepLabel>
          </Step>
        );
      })}
    </StyledStepper>
  );
};

export default Stepper;
