import { withServerSideProps } from "common/HOCs";
import { NextPageLayout } from "types/common";

const Settings: NextPageLayout = () => {
  return <></>;
};

export const getServerSideProps = withServerSideProps((props) => {
  return {
    redirect: {
      destination: "/settings/members",
      permanent: false,
    },
  };
});

export default Settings;
