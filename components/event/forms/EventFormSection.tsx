import { FC } from "react";
import { WithChildren } from "types/common";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/system";

interface IEventFormSectionProps {
  label: string;
}

const EventFormSection: FC<WithChildren<IEventFormSectionProps>> = ({
  label,
  children,
}) => {
  const theme = useTheme();

  return (
    <>
      <Grid item>
        <Typography
          variant="h4"
          sx={{
            borderBottom: `3px solid ${theme.palette.common.black}`,
            fontWeight: "bold",
            width: "fit-content",
            lineHeight: "2rem",
          }}
        >
          {label}
        </Typography>
      </Grid>
      <Grid item sx={{ mt: 1 }}>
        {children}
      </Grid>
    </>
  );
};

export default EventFormSection;
