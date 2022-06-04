import { FC } from "react";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { EvaIcon } from "components/base";

interface IDropzoneItemProps {
  onRemove(index: number): void;
  file: File;
  index: number;
}

const DropzoneItem: FC<IDropzoneItemProps> = ({ onRemove, file, index }) => {
  const theme = useTheme();

  const onRemoveItem = () => onRemove(index);

  return (
    <Grid container item alignItems="center">
      <Grid item xs={6}>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          {file.name}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <IconButton
          onClick={onRemoveItem}
          sx={{ padding: theme.spacing(0.5, 1) }}
        >
          <Box mt={0.5}>
            <EvaIcon
              name={"trash-outline"}
              fill={theme.palette.error.main}
              style={{ transform: "scale(0.9)" }}
              size="large"
            />
          </Box>
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default DropzoneItem;
