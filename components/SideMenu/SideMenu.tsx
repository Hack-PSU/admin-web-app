import { FC, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { styled } from "@mui/system";
import { ControlledSelect, Select } from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { IHackathonEntity } from "types/api";
import { useQuery } from "react-query";
import { getAllHackathons } from "api/index";
import HackathonSelect from "components/SideMenu/HackathonSelect";

const Container = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: "100%",
  backgroundColor: theme.palette.menu.main,
  flexDirection: "column",
}));

const HackathonContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2.5, 4),
  borderBottom: `5px solid ${theme.palette.menu.line}`,
}));

const MenuOptions = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  flexDirection: "column",
}));

const SideMenu: FC = () => {
  const methods = useForm();

  const { data } = useQuery("hackathon", () => getAllHackathons());
  const hackathons = data?.data.body.data.map((hackathon) => ({
    value: hackathon.uid,
    display: hackathon.name,
  }));

  useEffect(() => {
    if (hackathons && hackathons.length > 0) {
      methods.setValue("hackathon", hackathons[0]);
    }
  }, [hackathons, methods]);

  return (
    <FormProvider {...methods}>
      <Container container>
        <HackathonContainer item>
          <ControlledSelect
            name="hackathon"
            placeholder={hackathons ? "" : "No hackathon"}
            items={hackathons || []}
            as={HackathonSelect}
          />
        </HackathonContainer>
        <MenuOptions item gap={1}></MenuOptions>
      </Container>
    </FormProvider>
  );
};

export default SideMenu;
