import type { NextPage } from "next";
import { withAuthPage, withDefaultLayout } from "common/HOCs";
import { AuthPermission } from "types/context";

const Home: NextPage = () => {
  return <></>;
};

export default withDefaultLayout(Home);
