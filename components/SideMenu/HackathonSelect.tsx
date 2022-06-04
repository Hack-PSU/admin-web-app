import React, { FC } from "react";
import { useTheme } from "@mui/system";
import { Select } from "components/base";
import { ISelectProps } from "types/components";

const HackathonSelect: FC<ISelectProps> = ({ ...props }) => {
  const theme = useTheme();

  return (
    <Select
      sx={{
        border: "none",
        padding: theme.spacing(1, 2),
        width: "90%",
      }}
      inputProps={{
        style: {
          fontWeight: "bold",
          fontSize: "1.2rem",
        },
      }}
      menuWidth={"15%"}
      {...props}
    />
  );
};

export default HackathonSelect;
