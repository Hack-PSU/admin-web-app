import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WithChildren } from "types/common";
import { useImmer } from "use-immer";
import { IStepItem } from "./types";

interface IStepperContextHooks {
  getState(index: number): { step: IStepItem; skipped?: boolean };
  onClickNext(): void;
  onClickPrevious(): void;
  onClickGoto(index: number, skip?: number): void;
  register(index: number, label: string, optional?: boolean): void;
  activeStep: number;
  steps: { [key: string]: IStepItem };
  skipped: { [key: string]: boolean };
}

const StepperContext = createContext<IStepperContextHooks>(
  {} as IStepperContextHooks
);

const StepperProvider: FC<WithChildren> = ({ children }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [steps, setSteps] = useImmer<{ [key: string]: IStepItem }>({});
  const [skipped, setSkipped] = useImmer<{ [key: string]: boolean }>({});

  const onClickNext = useCallback(() => {
    setActiveStep((step) => step + 1);
  }, []);

  const onClickPrevious = useCallback(() => {
    setActiveStep((step) => step - 1);
  }, []);

  const onClickGoto = useCallback(
    (step: number, skip?: number) => {
      if (skip) {
        setSkipped((skipped) => {
          skipped[skip] = true;
        });
      }
      setActiveStep(step);
    },
    [setSkipped]
  );

  const register = useCallback(
    (index: number, label: string, optional?: boolean) => {
      setSteps((steps) => {
        if (!Object.keys(steps).includes(String(index))) {
          steps[index] = { label, optional };
        }
      });
      if (optional) {
        setSkipped((skipped) => {
          if (!Object.keys(skipped).includes(String(index))) {
            skipped[index] = false;
          }
        });
      }
    },
    [setSkipped, setSteps]
  );

  const getState = useCallback(
    (index: number) => {
      return {
        step: steps[String(index)],
        skipped: skipped[String(index)] ?? undefined,
      };
    },
    [skipped, steps]
  );

  const value = useMemo(
    () => ({
      onClickNext,
      onClickPrevious,
      onClickGoto,
      register,
      getState,
      activeStep,
      steps,
      skipped,
    }),
    [
      onClickNext,
      onClickPrevious,
      onClickGoto,
      register,
      getState,
      activeStep,
      steps,
      skipped,
    ]
  );

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  );
};

export const useStepperContext = () => useContext(StepperContext);

export function useStepper(
  step: number,
  label: string,
  options?: { optional?: boolean }
) {
  const {
    register,
    getState,
    onClickGoto,
    onClickPrevious,
    onClickNext,
    activeStep,
  } = useStepperContext();

  const optional = options?.optional ?? false;

  useEffect(() => {
    register(step, label, optional);
  }, []);

  return {
    nextStep: onClickNext,
    previousStep: onClickPrevious,
    gotoStep: onClickGoto,
    activeStep,
    active: activeStep === step,
  };
}

export default StepperProvider;
