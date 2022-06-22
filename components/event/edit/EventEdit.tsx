import { FC } from "react";
import { WithChildren } from "types/common";
import { Grid, Typography, useTheme } from "@mui/material";

interface IEventEditProps {
  title: string;
}

const EventEdit: FC<WithChildren<IEventEditProps>> = ({ title, children }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      item
      sx={{
        padding: theme.spacing(2, 2.5),
        backgroundColor: "common.white",
        boxShadow: 2,
        borderRadius: "15px",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Grid item>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "common.black" }}
        >
          {title}
        </Typography>
      </Grid>
      {children}
    </Grid>
  );
};

export default EventEdit;
