import type { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import TimeInput from "components/base/Pickers/TimeInput";
import { Grid } from "@mui/material";

type LocationEntity = {
  name: string;
  uid: number;
};

const Home: NextPage = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <TimeInput value={new Date()} />
      </Grid>
    </Grid>
  );
};

// export const getServerSideProps = withServerSideProps(() => {
//   return {
//     redirect: {
//       destination: "/hackers",
//       permanent: false,
//     },
//   };
// });

export default withDefaultLayout(Home);
