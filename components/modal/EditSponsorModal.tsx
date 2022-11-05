import React, { FC, useCallback, useEffect, useMemo } from "react";
import {
  CreateEntity,
  fetch,
  ISponsorshipCreateEntity,
  QueryKeys,
  updateSponsor,
} from "api";
import {
  Button,
  ControlledInput,
  ControlledSelect,
  LabelledInput,
  LabelledSelect,
  Modal,
} from "components/base";
import { useModal } from "components/context";
import { Grid } from "@mui/material";
import { IOption } from "types/components";
import { useForm, FormProvider } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

type Props = {
  sponsor: ISponsorshipCreateEntity | null;
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
        logo: sponsor.logo,
        websiteLink: sponsor.websiteLink ?? "",
      };
    }
    return {};
  }, [sponsor]);

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const { mutateAsync } = useMutation(
    ({ entity }: CreateEntity<ISponsorshipCreateEntity, "">) =>
      fetch(() => updateSponsor(entity)),
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
        await mutateAsync({
          entity: {
            uid: sponsor.uid,
            order: sponsor.order,
            name: data.name,
            level: data.level.value,
            websiteLink: data.websiteLink,
            logo: data.logo,
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
                name={"logo"}
                placeholder={"Enter link to logo"}
                as={LabelledInput}
                label={"Logo"}
                showError
              />
            </Grid>
            <Grid item xs={12}>
              <ControlledInput
                name={"websiteLink"}
                placeholder={"Enter sponsor's website"}
                as={LabelledInput}
                label={"Website"}
                showError
              />
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
