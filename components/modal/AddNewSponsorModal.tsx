import React, { FC, useCallback } from "react";
import { useModal } from "components/context";
import {
  ControlledInput,
  ControlledSelect,
  LabelledInput,
  LabelledSelect,
  MenuButton,
  Modal,
} from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import _ from "lodash";
import { IOption } from "types/components";
import { Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { CreateEntity, createSponsor, fetch, ISponsorshipEntity } from "api";

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

const AddNewSponsorModal: FC = () => {
  const methods = useForm({
    defaultValues: {
      name: "",
      level: {
        value: SponsorLevel.GOLD,
        label: _.startCase(SponsorLevel.GOLD),
      } as IOption,
      logo: "",
      websiteLink: "",
    },
  });
  const { show, handleHide } = useModal("addNewSponsor");

  const { mutateAsync } = useMutation(
    ({ entity }: CreateEntity<ISponsorshipEntity, "uid" | "order">) =>
      fetch(() => createSponsor(entity)),
    {}
  );

  const { handleSubmit, reset } = methods;

  const onClickSubmit = () => {
    handleSubmit(async (data) => {
      await mutateAsync({
        entity: {
          name: data.name,
          level: data.level.value,
          logo: data.logo,
          website_link: data.websiteLink,
        },
      });
      handleHide();
    })();
  };

  const onClickSubmitCreate = () => {
    handleSubmit(async (data) => {
      await mutateAsync({
        entity: {
          name: data.name,
          level: data.level.value,
          logo: data.logo,
          website_link: data.websiteLink,
        },
      });
      reset();
    })();
  };

  return (
    <FormProvider {...methods}>
      <Modal open={show} onClose={handleHide}>
        <Modal.Header>Add Sponsor</Modal.Header>
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
            <MenuButton
              onClick={onClickSubmit}
              menuItems={[
                {
                  label: "Submit and Create",
                  onClick: onClickSubmitCreate,
                },
              ]}
            >
              Save
            </MenuButton>
          </Grid>
        </Modal.Body>
      </Modal>
    </FormProvider>
  );
};

export default AddNewSponsorModal;
