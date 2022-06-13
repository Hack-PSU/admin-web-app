import { FC } from "react";
import { WithChildren } from "types/common";
import {
  alpha,
  Grid,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";

interface IEventFormSectionProps {
  label: string;
  sx?: SxProps<Theme>;
}

const EventFormSection: FC<WithChildren<IEventFormSectionProps>> = ({
  label,
  children,
  sx,
}) => {
  const theme = useTheme();

  return (
    <>
      <Grid
        item
        sx={{
          borderBottom: `1.5px solid ${alpha(theme.palette.common.black, 0.1)}`,
          ...sx,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: theme.typography.pxToRem(22),
            fontWeight: "bold",
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
