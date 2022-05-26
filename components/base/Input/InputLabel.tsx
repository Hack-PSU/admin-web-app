import { FC } from "react";
import { InputLabelProps } from "types/components";
import { Grid, styled, Typography } from "@mui/material";

const StyledLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.black,
  fontSize: "0.9rem",
  fontWeight: 500,
}));

const InputLabel: FC<InputLabelProps> =
  ({
     id, label, error,
     showError,
   }) => {
    return (
      <Grid container justifyContent="space-between">
        <Grid item sx={{ width: showError ? "50%" : "100%" }}>
          <label htmlFor={id}>
            <StyledLabel variant="body1">
              {label}
            </StyledLabel>
          </label>
        </Grid>
        {showError && error &&
          <StyledLabel variant="subtitle1" sx={{ color: "error.light" }}>
            {error}
          </StyledLabel>
        }
      </Grid>
    );
  };

export default InputLabel;