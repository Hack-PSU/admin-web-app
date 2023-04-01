import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import {
  fetch,
  QueryEntity,
  QueryKeys,
  SponsorEntity,
  updateSponsor,
} from "api";
import {
  Button,
  ControlledDropzone,
  ControlledInput,
  ControlledSelect,
  DropzonePlaceholder,
  InputLabel,
  LabelledDropzone,
  LabelledInput,
  LabelledSelect,
  Modal,
} from "components/base";
import { useModal } from "components/context";
import { Grid } from "@mui/material";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { IOption } from "components/base/Select/types";
import { SponsorLogoItem } from "components/sponsorship";
import { DateTime } from "luxon";

type Props = {
  sponsor: SponsorEntity | null;
};

enum SponsorLevel {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum",
  EMERALD = "emerald",
}

const SponsorLevelOptions: IOption[] = [
  {
    value: SponsorLevel.BRONZE,
    label: "Bronze",
  },
  {
    value: SponsorLevel.SILVER,
    label: "Silver",
  },
  {
    value: SponsorLevel.GOLD,
    label: "Gold",
  },
  {
    value: SponsorLevel.PLATINUM,
    label: "Platinum",
  },
  {
    value: SponsorLevel.EMERALD,
    label: "Emerald",
  },
];

const getSponsorshipLevelOption = (option: SponsorLevel) => {
  switch (option.toLowerCase()) {
    case SponsorLevel.BRONZE:
      return {
        value: SponsorLevel.BRONZE,
        label: "Bronze",
      };
    case SponsorLevel.SILVER:
      return {
        value: SponsorLevel.SILVER,
        label: "Silver",
      };
    case SponsorLevel.GOLD:
      return {
        value: SponsorLevel.GOLD,
        label: "Gold",
      };
    case SponsorLevel.PLATINUM:
      return {
        value: SponsorLevel.PLATINUM,
        label: "Platinum",
      };
    case SponsorLevel.EMERALD:
      return {
        value: SponsorLevel.EMERALD,
        label: "Emerald",
      };
  }
};

const PreviewLogo: FC<{ name: string; fallback: string }> = ({
  name: watchName,
  fallback,
}) => {
  const { watch, getValues } = useFormContext();
  const imgRef = useRef<HTMLImageElement>(null);

  const getImageUrl = useCallback((image: File) => {
    const fr = new FileReader();
    fr.onload = (event) => {
      if (
        imgRef.current !== null &&
        event.target !== null &&
        typeof event.target.result === "string"
      ) {
        imgRef.current.src = event.target.result;
      }
    };
    fr.readAsDataURL(image);
  }, []);

  useEffect(() => {
    return watch((value, { name }) => {
      if (name === watchName) {
        if (value[name].length === 0 && imgRef.current !== null) {
          imgRef.current.src = `${
            value[fallback]
          }?m=${DateTime.now().toMillis()}`;
        } else if (value[name].length > 0) {
          getImageUrl(value[name][0]);
        }
      }
    }).unsubscribe;
  }, [fallback, getImageUrl, watch, watchName]);

  useEffect(() => {
    if (imgRef.current !== null) {
      if (getValues(watchName).length === 0) {
        imgRef.current.src = `${getValues(
          fallback
        )}?m=${DateTime.now().toMillis()}`;
      } else {
        getImageUrl(getValues(watchName)[0]);
      }
    }
  }, [fallback, getImageUrl, getValues, watchName]);

  return <img ref={imgRef} width={"100%"} height={"auto"} />;
};

const EditSponsorModal: FC<Props> = ({ sponsor }) => {
  const { show, handleHide } = useModal("editSponsor");

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(() => {
    if (sponsor) {
      return {
        name: sponsor.name ?? "",
        level: getSponsorshipLevelOption(
          sponsor.level as SponsorLevel
        ) as IOption,
        lightLogoUrl: sponsor.lightLogo ?? "",
        lightLogo: [],
        darkLogoUrl: sponsor.darkLogo ?? "",
        darkLogo: [],
        link: sponsor.link ?? "",
      };
    }
    return {};
  }, [sponsor]);

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, reset, watch } = methods;

  const { mutateAsync } = useMutation(
    ({ entity: { data, id } }: QueryEntity<{ data: FormData; id: number }>) =>
      fetch(() => updateSponsor(data, { id })),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.sponsorship.all);
        enqueueSnackbar("Successfully updated sponsor", {
          variant: "success",
        });
      },
    }
  );

  const onClickSubmit = useCallback(() => {
    if (sponsor) {
      handleSubmit(async (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("level", data.level.value);
        formData.append("link", data.link);

        if (data.lightLogo.length > 0) {
          formData.append("lightLogo", data.lightLogo[0]);
        }

        if (data.darkLogo.length > 0) {
          formData.append("darkLogo", data.darkLogo[0]);
        }

        await mutateAsync({
          entity: {
            data: formData,
            id: sponsor.id,
          },
        });
        reset();
        handleHide();
      })();
    }
  }, [handleHide, handleSubmit, mutateAsync, reset, sponsor]);

  useEffect(() => {
    if (defaultValues && sponsor) {
      reset({ ...defaultValues });
    }
  }, [sponsor, defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <Modal open={show} onClose={handleHide}>
        <Modal.Header>Edit Sponsor</Modal.Header>
        <Modal.Body>
          <Grid container item spacing={2}>
            <Grid item xs={6}>
              <ControlledInput
                id={"name"}
                name={"name"}
                placeholder={"Enter sponsor name"}
                as={LabelledInput}
                label={"Name"}
                showError
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledSelect
                id={"level"}
                name={"level"}
                options={SponsorLevelOptions}
                as={LabelledSelect}
                label={"Level"}
                showError
              />
            </Grid>
            <Grid item xs={12}>
              <ControlledInput
                name={"link"}
                placeholder={"Enter sponsor's website"}
                as={LabelledInput}
                label={"Website"}
                showError
              />
            </Grid>
            <Grid container item xs={6} flexDirection={"column"} gap={1}>
              <InputLabel
                id={"light-logo-preview"}
                label={"Light Logo Preview"}
              />
              <Grid item>
                <PreviewLogo name={"lightLogo"} fallback={"lightLogoUrl"} />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <ControlledDropzone
                name={"lightLogo"}
                as={LabelledDropzone}
                id={"light-logo"}
                label={"Replace Light Mode Logo"}
              >
                {watch("lightLogo", [])?.length > 0 ? (
                  <SponsorLogoItem name={"lightLogo"} />
                ) : (
                  <DropzonePlaceholder />
                )}
              </ControlledDropzone>
            </Grid>
            <Grid container item xs={6} flexDirection={"column"} gap={1}>
              <InputLabel
                id={"dark-logo-preview"}
                label={"Dark Logo Preview"}
              />
              <Grid item sx={{ backgroundColor: "common.black" }}>
                <PreviewLogo name={"darkLogo"} fallback={"darkLogoUrl"} />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <ControlledDropzone
                name={"darkLogo"}
                as={LabelledDropzone}
                id={"dark-logo"}
                label={"Replace Dark Mode Logo"}
              >
                {watch("darkLogo", [])?.length > 0 ? (
                  <SponsorLogoItem name={"darkLogo"} />
                ) : (
                  <DropzonePlaceholder />
                )}
              </ControlledDropzone>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            justifyContent={"center"}
            sx={{
              mt: 2,
            }}
          >
            <Button onClick={onClickSubmit}>Save</Button>
          </Grid>
        </Modal.Body>
      </Modal>
    </FormProvider>
  );
};

export default EditSponsorModal;
