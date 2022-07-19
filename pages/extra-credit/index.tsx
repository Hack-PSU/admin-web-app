import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";

const ExtraCreditPage: NextPage = () => {
  return <></>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/extra-credit/classes",
      permanent: false,
    },
  };
};

export default withDefaultLayout(ExtraCreditPage);
