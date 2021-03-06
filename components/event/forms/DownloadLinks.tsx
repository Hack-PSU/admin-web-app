import { FC, useEffect, useState } from "react";
import {
  useFieldArray,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  Box,
  darken,
  Grid,
  IconButton,
  Typography,
  useTheme,
  colors,
} from "@mui/material";
import { EvaIcon, Input, Button } from "components/base";

type FieldValues = {
  link: string;
};

interface IDownloadLinkInputProps {
  update: UseFieldArrayUpdate<FieldValues>;
  remove: UseFieldArrayRemove;
  value: any;
  index: number;
}

const DownloadLinkInput: FC<IDownloadLinkInputProps> = ({
  update,
  value,
  index,
  remove,
}) => {
  const { register, handleSubmit, watch } = useForm({ defaultValues: value });
  const theme = useTheme();

  const onClickSubmit = () => {
    handleSubmit((data) => {
      update(index, data);
    })();
  };

  return (
    <Grid
      container
      item
      columnSpacing={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid item sx={{ flexGrow: 1 }} xs={10.5}>
        <Input
          {...register("link")}
          placeholder={"Enter a download link"}
          sx={{
            border: "none",
            width: "100%",
            padding: theme.spacing(1, 1, 1, 0),
            ":hover": {
              border: "none",
            },
            "&.Mui-focused": {
              boxShadow: 0,
            },
          }}
          type="url"
          autoComplete="url"
          autoCorrect="url"
        />
      </Grid>
      <Grid container item justifyContent="flex-end" xs={1.5}>
        <Grid item xs={6}>
          <IconButton sx={{ height: "40px" }} onClick={onClickSubmit}>
            <Box mt={0.5}>
              <EvaIcon
                name={"checkmark"}
                fill={
                  value.link !== ""
                    ? theme.palette.success.main
                    : theme.palette.common.black
                }
                size="large"
              />
            </Box>
          </IconButton>
        </Grid>
        <Grid item xs={6}>
          <IconButton sx={{ height: "40px" }} onClick={() => remove(index)}>
            <Box mt={0.5}>
              <EvaIcon name="trash-outline" fill="#F37A7A" size="large" />
            </Box>
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

const DownloadLinks: FC = () => {
  const { fields, append, update, remove } = useFieldArray({
    name: "wsUrls",
  });
  const theme = useTheme();

  return (
    <Grid container item gap={0.5} flexDirection="column">
      <Grid container item alignItems="center" sx={{ height: "fit-content" }}>
        <Grid item xs={4}>
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", fontSize: "1.05rem" }}
          >
            Download Links
          </Typography>
        </Grid>
      </Grid>
      <Grid container item flexDirection="column" gap={0.5}>
        {fields.map((field, index) => (
          <DownloadLinkInput
            // @ts-ignore
            update={update}
            value={field}
            index={index}
            key={field.id}
            remove={remove}
          />
        ))}
      </Grid>
      <Grid item>
        <Button
          startIcon={
            <Box pt={0.5}>
              <EvaIcon
                name={"plus-outline"}
                size="medium"
                fill={colors.blue["700"]}
              />
            </Box>
          }
          sx={{
            lineHeight: "1.5rem",
            padding: theme.spacing(0),
            backgroundColor: "transparent",
            ":hover": {
              backgroundColor: "transparent",
            },
          }}
          onClick={() => append({ link: "" })}
          textProps={{
            sx: {
              color: colors.blue["700"],
              ":hover": {
                color: darken(colors.blue["700"], 0.3),
              },
            },
          }}
          disableRipple
          variant="text"
        >
          Add Link
        </Button>
      </Grid>
    </Grid>
  );
};

export default DownloadLinks;
