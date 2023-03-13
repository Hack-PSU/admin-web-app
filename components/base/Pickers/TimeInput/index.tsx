import React, { FC, useCallback, useEffect, useState } from "react";
import { WithLabelledProps } from "types/components";
import { UseControllerReturn } from "react-hook-form";
import { Box, Grid, GridProps, styled } from "@mui/material";
import { DateTime } from "luxon";
import { EvaIcon, InputLabel } from "components/base";
import TimeComponent from "components/base/Pickers/TimeInput/TimeComponent";

type Props = GridProps & {
  value: Date;
  onChange?: UseControllerReturn["field"]["onChange"];
};

type LabelledTimeInputProps = WithLabelledProps<Props>;

const Container = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(0.8, 1.8),
  border: `2px solid ${theme.palette.border.light}`,
  borderRadius: "15px",
  color: theme.palette.common.black,
  width: "100%",
  boxShadow: undefined,
  alignItems: "center",
  ":hover": {
    borderColor: theme.palette.sunset.light,
  },
}));

const TimeInputAdornment: FC = () => (
  <Grid container item justifyContent={"flex-end"}>
    <Grid item>
      <EvaIcon name={"clock-outline"} size={"large"} fill={"#1a1a1a"} />
    </Grid>
  </Grid>
);

const TimeInput: FC<Props> = ({ value, onChange, ...props }) => {
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const [ampm, setAMPM] = useState<string>("AM");

  const [active, setActive] = useState<string>("");

  const toDate = useCallback(() => {
    return DateTime.fromFormat(
      `${hour}:${minute} ${ampm}`,
      "hh:mm a"
    ).toJSDate();
  }, [hour, minute, ampm]);

  const switchActive = useCallback((name: string) => {
    setActive(name);
  }, []);

  useEffect(() => {
    if (DateTime.fromFormat(`${hour}:${minute} ${ampm}`, "hh:mm a").isValid) {
      onChange?.(toDate());
    }
  }, [toDate, onChange, hour, minute, ampm]);

  useEffect(() => {
    const dateTime = DateTime.fromJSDate(value);
    setHour(() => (dateTime.hour % 12).toString().padStart(2, "0"));
    setMinute(() => dateTime.minute.toString().padStart(2, "0"));
    setAMPM(() => dateTime.toFormat("a").toUpperCase());
  }, []);

  return (
    <Container container {...props}>
      <Grid item flexGrow={1} height={"1.4735em"}>
        <TimeComponent
          value={hour}
          name={"hour"}
          active={active}
          onClick={switchActive}
          variant={"number"}
          onChange={setHour}
        />
        <span>:</span>
        <TimeComponent
          value={minute}
          name={"minute"}
          active={active}
          onClick={switchActive}
          variant={"number"}
          onChange={setMinute}
        />
        <TimeComponent
          value={ampm}
          name={"ampm"}
          active={active}
          onClick={switchActive}
          variant={"ampm"}
          onChange={setAMPM}
        />
      </Grid>
      <Grid item width={"10%"} height={"1.4735em"}>
        <TimeInputAdornment />
      </Grid>
    </Container>
  );
};

export const LabelledTimeInput: FC<LabelledTimeInputProps> = ({
  id,
  label,
  error,
  showError,
  ...props
}) => {
  return (
    <>
      <InputLabel id={id} label={label} error={error} showError={showError} />
      <Box mt={0.6}>
        <TimeInput {...props} />
      </Box>
    </>
  );
};

export default TimeInput;
