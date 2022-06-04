import React, { FC } from "react";
import { Button, darken, Grid, Typography, useTheme } from "@mui/material";

type AMPM = "AM" | "PM";

const Option: FC<{
  option: AMPM;
  selectedAMPM: AMPM;
  activeColor: string;
  setAMPM(ampm: AMPM): void;
}> = ({ selectedAMPM, option, activeColor, setAMPM }) => {
  const selected = option === selectedAMPM;
  const theme = useTheme();

  return (
    <Grid item>
      <Button
        variant="text"
        sx={{
          backgroundColor: selected ? activeColor : "transparent",
          padding: theme.spacing(1, 1),
          ":hover": {
            backgroundColor: selected
              ? darken(activeColor, 0.05)
              : darken("#fff", 0.05),
          },
        }}
        disableRipple
        onClick={() => setAMPM(option)}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: "0.9rem",
            fontFamily: "Poppins",
            color: selected ? "common.white" : "common.black",
          }}
        >
          {option}
        </Typography>
      </Button>
    </Grid>
  );
};

const TimePickerAMPM: FC<{
  selectedAMPM: "AM" | "PM";
  activeColor: string;
  setAMPM(ampm: "AM" | "PM"): void;
}> = ({ selectedAMPM, activeColor, setAMPM }) => {
  return (
    <Grid container item xs={4} flexDirection="column" gap={1}>
      <Option
        option={"AM"}
        selectedAMPM={selectedAMPM}
        activeColor={activeColor}
        setAMPM={setAMPM}
      />
      <Option
        option={"PM"}
        selectedAMPM={selectedAMPM}
        activeColor={activeColor}
        setAMPM={setAMPM}
      />
    </Grid>
  );
};

export default TimePickerAMPM;
