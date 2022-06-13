import { FC, useEffect, useState } from "react";
import {
  useFieldArray,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useForm,
} from "react-hook-form";
import {
  Box,
  darken,
  Grid,
  IconButton,
  Typography,
  useTheme,
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

  const [confirm, setConfirm] = useState<boolean>(false);

  const onClickSubmit = () => {
    setConfirm(true);
    handleSubmit((data) => {
      update(index, data);
    });
  };

  useEffect(() => {
    const subscription = watch((data) => {
      if (data.link !== value.link) {
        setConfirm(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [value.link, watch]);

  return (
    <Grid
      container
      item
      gap={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid item sx={{ flexGrow: 1 }}>
        <Input
          {...register("link")}
          placeholder={"Enter a download link"}
          sx={{
            border: "none",
            width: "100%",
            padding: theme.spacing(1, 1, 1, 0),
          }}
          type="url"
          autoComplete="url"
          autoCorrect="url"
        />
      </Grid>
      <Grid container item justifyContent="flex-end" sx={{ width: "10%" }}>
        <Grid item>
          <IconButton sx={{ height: "40px" }} onClick={onClickSubmit}>
            <Box mt={0.5}>
              <EvaIcon
                name={"checkmark"}
                fill={
                  confirm
                    ? theme.palette.success.main
                    : theme.palette.common.black
                }
                size="large"
              />
            </Box>
          </IconButton>
        </Grid>
        <Grid item>
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
    name: "downloadLinks",
  });
  const theme = useTheme();

  return (
    <Grid container item gap={2} flexDirection="column">
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
              <EvaIcon name={"plus-outline"} size="medium" fill="#2878DA" />
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
              color: "#2878DA",
              ":hover": {
                color: darken("#2878DA", 0.3),
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
