import { FC } from "react";
import { WithChildren } from "types/common";
import { Grid } from "@mui/material";

interface IEventFormPanelProps {
  value: number;
  index: number;
}

const EventFormPanel: FC<WithChildren<IEventFormPanelProps>> = ({
  value,
  index,
  children,
}) => {
  return (
    <Grid item hidden={value !== index}>
      {children}
    </Grid>
  );
};

export default EventFormPanel;
