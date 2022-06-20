import { FC } from "react";
import { InputLabelProps } from "types/components";
import { Box, Grid, styled, Typography, useTheme } from "@mui/material";
import { FormErrorCode, parseFormError } from "common/form";
import { EvaIcon } from "components/base";

const StyledLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.black,
  fontSize: "0.9rem",
  fontWeight: 500,
}));

const InputLabel: FC<InputLabelProps> = ({ id, label, error, showError }) => {
  const theme = useTheme();
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Grid item sx={{ width: showError ? "fit-content" : "100%" }}>
        <label htmlFor={id}>
          <StyledLabel variant="body1" sx={{ fontWeight: 600 }}>
            {label}
          </StyledLabel>
        </label>
      </Grid>
      {showError && error && (
        <Grid
          container
          item
          alignItems="center"
          sx={{ width: "fit-content" }}
          spacing={1}
        >
          <Grid item>
            <Box mt={0.5}>
              <EvaIcon
                name={"alert-circle"}
                fill={theme.palette.error.main}
                size="medium"
              />
            </Box>
          </Grid>
          <Grid item>
            <StyledLabel variant="subtitle1" sx={{ color: "error.main" }}>
              {parseFormError(error as FormErrorCode, label)}
            </StyledLabel>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default InputLabel;
