import React, { FC } from "react";
import { Button, EvaIcon } from "components/base";
import { Box, useTheme } from "@mui/material";

interface IRefreshActionProps {
  onClick(): void;
}

const RefreshAction: FC<IRefreshActionProps> = ({ onClick }) => {
  const theme = useTheme();

  return (
    <Button
      startIcon={
        <Box mt={0.5}>
          <EvaIcon
            name={"refresh-outline"}
            size="medium"
            fill={theme.palette.common.black}
          />
        </Box>
      }
      sx={{
        lineHeight: "1.5rem",
        padding: theme.spacing(0.5, 2),
        borderRadius: "10px",
        alignItems: "center",
        width: "90%",
      }}
      textProps={{
        sx: {
          fontSize: theme.typography.pxToRem(14),
        },
      }}
      onClick={onClick}
    >
      Refresh
    </Button>
  );
};

export default RefreshAction;