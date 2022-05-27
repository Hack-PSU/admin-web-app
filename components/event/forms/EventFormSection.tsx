import { FC } from "react";
import { WithChildren } from "types/common";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/system";

interface IEventFormSectionProps {
  label: string
}

const EventFormSection: FC<WithChildren<IEventFormSectionProps>> = ({ label, children }) => {
  const theme = useTheme();

  return (
    <>
      <Grid item>
        <Typography
          variant="h4"
          sx={{
            borderBottom: `3px solid ${theme.palette.common.black}`,
            fontWeight: 500,
          }}
        >
          { label }
        </Typography>
      </Grid>
      <Grid item>
        { children }
      </Grid>
    </>
  );
};

export default EventFormSection;