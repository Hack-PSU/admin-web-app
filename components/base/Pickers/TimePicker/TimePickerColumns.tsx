import React, { FC } from "react";
import { darken, Grid, Typography, useTheme } from "@mui/material";

const TimePickerColumn: FC<{
  items: string[];
  selected: string;
  activeColor: string;
  onClick(item: string): void;
}> = ({ items, selected, activeColor, onClick }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      item
      flexDirection="column"
      xs={4}
      alignItems="center"
      gap={1}
    >
      {items.map((item) => {
        const itemSelected = selected === item;
        return (
          <Grid
            item
            key={item}
            onClick={() => onClick(item)}
            sx={{
              padding: theme.spacing(0.3, 1),
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: itemSelected ? activeColor : "transparent",
              transition: "200ms background-color ease-in-out",
              ":hover": {
                backgroundColor: itemSelected
                  ? undefined
                  : darken("#fff", 0.05),
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "0.9rem",
                fontFamily: "Poppins",
                color: itemSelected ? "common.white" : "common.black",
              }}
            >
              {item}
            </Typography>
          </Grid>
        );
      })}
    </Grid>
  );
};

export const TimePickerHours: FC<{
  selectedHour: string;
  activeColor: string;
  setHour(hour: string): void;
}> = ({ selectedHour, activeColor, setHour }) => {
  const hours = Array(12)
    .fill(0)
    .map((_, index) => String(index + 1).padStart(2, "0"));

  return (
    <TimePickerColumn
      items={hours}
      selected={selectedHour}
      activeColor={activeColor}
      onClick={setHour}
    />
  );
};

export const TimePickerMinutes: FC<{
  selectedMinute: string;
  activeColor: string;
  setMinute(minute: string): void;
}> = ({ selectedMinute, activeColor, setMinute }) => {
  const minutes = Array(60 / 5)
    .fill(0)
    .map((_, index) => String(index * 5).padStart(2, "0"));

  return (
    <TimePickerColumn
      items={minutes}
      selected={selectedMinute}
      activeColor={activeColor}
      onClick={setMinute}
    />
  );
};
