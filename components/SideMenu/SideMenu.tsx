import { FC, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { styled } from "@mui/system";
import { ControlledSelect, Select } from "components/base";
import { useForm, FormProvider } from "react-hook-form";
import { IHackathonEntity } from "types/api";
import { useQuery } from "react-query";
import { getAllHackathons } from "api/index";
import HackathonSelect from "components/SideMenu/HackathonSelect";
import Option from "./Option";

const Container = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: "100%",
  backgroundColor: theme.palette.menu.main,
  flexDirection: "column",
}));

const HackathonContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  borderBottom: `5px solid ${theme.palette.menu.line}`,
}));

const MenuOptions = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2, 3),
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
        <MenuOptions container item gap={2.3}>
          <Option to={"/hackers"} icon={"people-outline"} option={"Hackers"} />
          <Option
            to={"/events"}
            icon={"calendar-outline"}
            option={"Events/Workshops"}
          />
          <Option to={"/locations"} icon={"pin-outline"} option={"Locations"} />
          <Option
            to={"/extra-credit"}
            icon={"award-outline"}
            option={"Extra Credit"}
          />
          <Option
            to={"/checkout"}
            icon={"shopping-cart-outline"}
            option={"Item Checkout"}
          />
          <Option
            to={"/analytics"}
            icon={"bar-chart-2-outline"}
            option={"Analytics"}
          />
          <Option
            to={"/sponsorship"}
            icon={"gift-outline"}
            option={"Sponsorship"}
          />
          <Option to={"/judging"} icon={"star-outline"} option={"Judging"} />
        </MenuOptions>
      </Container>
    </FormProvider>
  );
};

export default SideMenu;
