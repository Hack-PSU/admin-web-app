import React, { FC, useEffect } from "react";
import { useModal } from "components/context";
import {
  ControlledDropzone,
  ControlledInput,
  ControlledSelect,
  DropzonePlaceholder,
  LabelledDropzone,
  LabelledInput,
  LabelledSelect,
  MenuButton,
  Modal,
} from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import _ from "lodash";
import { Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createSponsor, fetch, QueryEntity } from "api";
import { IOption } from "components/base/Select/types";
import { SponsorLogoItem } from "components/sponsorship";

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

const AddNewSponsorModal: FC<{ totalSponsors: number }> = ({
  totalSponsors,
}) => {
  const methods = useForm({
    defaultValues: {
      name: "",
      level: {
        value: SponsorLevel.GOLD,
        label: _.startCase(SponsorLevel.GOLD),
      } as IOption,
      lightLogo: [],
      darkLogo: [],
      link: "",
      order: totalSponsors,
    },
  });

  const { show, handleHide } = useModal("addNewSponsor");

  const { mutateAsync } = useMutation(
    ({ entity }: QueryEntity<FormData>) => fetch(() => createSponsor(entity)),
    {}
  );

  const { handleSubmit, reset, watch, setValue } = methods;

  useEffect(() => {
    setValue("order", totalSponsors);
  }, [setValue, totalSponsors]);

  const submitData = (next?: () => void) => {
    handleSubmit(async (data) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("level", data.level.value);
      formData.append("link", data.link);
      formData.append("order", String(data.order));

      if (data.darkLogo.length > 0) {
        formData.append("darkLogo", data.darkLogo[0]);
      }

      if (data.lightLogo.length > 0) {
        formData.append("lightLogo", data.lightLogo[0]);
      }

      await mutateAsync({
        entity: formData,
      });

      next?.();
    })();
  };

  const onClickSubmit = () => {
    submitData(handleHide);
  };

  const onClickSubmitCreate = () => {
    submitData(reset);
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
                name={"link"}
                placeholder={"Enter sponsor's website"}
                as={LabelledInput}
                label={"Website"}
                showError
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledDropzone
                name={"lightLogo"}
                as={LabelledDropzone}
                id={"light-logo"}
                label={"Light Mode Logo"}
                custom
              >
                {watch("lightLogo", []).length > 0 ? (
                  <SponsorLogoItem name={"lightLogo"} />
                ) : (
                  <DropzonePlaceholder />
                )}
              </ControlledDropzone>
            </Grid>
            <Grid item xs={6}>
              <ControlledDropzone
                name={"darkLogo"}
                as={LabelledDropzone}
                id={"dark-logo"}
                label={"Dark Mode Logo"}
                custom
              >
                {watch("darkLogo", []).length > 0 ? (
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
            <MenuButton
              onClick={onClickSubmit}
              menuItems={[
                {
                  label: "Submit and Create",
                  onClick: onClickSubmitCreate,
                },
              ]}
            >
              Submit
            </MenuButton>
          </Grid>
        </Modal.Body>
      </Modal>
    </FormProvider>
  );
};

export default AddNewSponsorModal;
