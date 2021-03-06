import type { NextPage } from "next";
import {
  withProtectedRoute,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { AuthPermission } from "types/context";
import { Grid } from "@mui/material";
import { ControlledSelect, Input, Select } from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import { DatePicker, TimePicker } from "components/base/Pickers";
import { useDateTime } from "common/hooks";

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
        <Select
          options={[
            { value: "Option1", label: "Option 1" },
            { value: "Option3", label: "Option 1" },
            { value: "Option2", label: "Option 2" },
          ]}
        />
      </Grid>
      <button onClick={onClickButton}>Click</button>
      {/*<Select placeholder={"Select here"} items={[{ value: "1", display: "1" }, { value: "2", display: "2" }]} />*/}
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps();

export default withDefaultLayout(Home);
