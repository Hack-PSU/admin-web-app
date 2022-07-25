import React, { FC, useState } from "react";
import { Button, EvaIcon } from "components/base";
import { Box, useTheme } from "@mui/material";

interface IDeleteActionProps {
  onClick(): void;
}

const DeleteAction: FC<IDeleteActionProps> = ({ onClick }) => {
  const [hover, setHover] = useState<boolean>(false);

  const theme = useTheme();

  return (
    <Button
      startIcon={
        <Box mt={0.5}>
          <EvaIcon
            name={"trash-outline"}
            size="medium"
            fill={hover ? theme.palette.common.white : theme.palette.error.main}
          />
        </Box>
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        lineHeight: "1.5rem",
        padding: theme.spacing(0.2, 2),
        borderRadius: "10px",
        alignItems: "center",
        backgroundColor: "common.white",
        border: `2px solid ${theme.palette.error.main}`,
        transition: "all 200ms ease-in-out",
        width: "90%",
        ":hover": {
          backgroundColor: "error.main",
        },
      }}
      textProps={{
        sx: {
          color: hover ? "common.white" : "error.main",
          fontSize: theme.typography.pxToRem(14),
        },
      }}
      onClick={onClick}
    >
      Delete
    </Button>
  );
};

export default DeleteAction;
