import type { NextPage } from "next";
import {
  withAuthPage,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { AuthPermission } from "types/context";
import { Grid } from "@mui/material";
import { ControlledSelect, Select } from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import { TimePicker } from "components/base/Pickers";

const Home: NextPage = () => {
  const methods = useForm();

  const onClickButton = () => {
    methods.handleSubmit((data, event) => {
      console.log(data);
    })();
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={10}>
        <TimePicker value={new Date()} placeholder={"Select a time"} />
      </Grid>
      {/*<ControlledSelect*/}
      {/*  name={"cselect"}*/}
      {/*  placeholder={"Select Here"}*/}
      {/*  items={[*/}
      {/*    { value: "1", display: "1" },*/}
      {/*    { value: "2", display: "2" },*/}
      {/*  ]}*/}
      {/*  menuWidth="74.5%"*/}
      {/*/>*/}
      {/*<button onClick={onClickButton}>Click</button>*/}
      {/*<Select placeholder={"Select here"} items={[{ value: "1", display: "1" }, { value: "2", display: "2" }]} />*/}
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps();

export default withDefaultLayout(Home);
