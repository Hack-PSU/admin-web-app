import { FC } from "react";
import {
  useFieldArray,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useForm,
} from "react-hook-form";
import {
  Box,
  Button,
  darken,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { EvaIcon, Input } from "components/base";

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
  const { register, handleSubmit } = useForm({ defaultValues: value });
  const theme = useTheme();

  return (
    <Grid container item gap={1} alignItems="center">
      <Grid item xs={6}>
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
      <Grid item xs={1}>
        <IconButton
          sx={{ height: "40px" }}
          onClick={handleSubmit((data) => update(index, data))}
        >
          <Box mt={0.5}>
            <EvaIcon name={"checkmark"} fill="#000" size="large" />
          </Box>
        </IconButton>
      </Grid>
      <Grid item xs={1}>
        <IconButton sx={{ height: "40px" }} onClick={() => remove(index)}>
          <Box mt={0.5}>
            <EvaIcon name="trash-outline" fill="#F37A7A" size="large" />
          </Box>
        </IconButton>
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
    <Grid container item gap={2} flexDirection="column" xs={7}>
      <Grid container item alignItems="center" sx={{ height: "fit-content" }}>
        <Grid item xs={4}>
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", fontSize: "1.05rem" }}
          >
            Download Links
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Button
            startIcon={
              <Box pt={0.5}>
                <EvaIcon name={"plus-outline"} size="medium" fill="#000" />
              </Box>
            }
            sx={{
              borderRadius: "15px",
              backgroundColor: "#efefef",
              color: "black",
              textTransform: "none",
              fontWeight: 500,
              fontFamily: "Poppins",
              lineHeight: "1.5rem",
              padding: theme.spacing(0.5, 2),
              ":hover": {
                backgroundColor: darken("#efefef", 0.05),
              },
            }}
            onClick={() => append({ link: "" })}
          >
            Add Link
          </Button>
        </Grid>
      </Grid>
      <Grid container item>
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
    </Grid>
  );
};

export default DownloadLinks;
