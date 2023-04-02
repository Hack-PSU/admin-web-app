import React from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";

const AnalyticsPage: NextPage = () => {
  return <></>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/analytics/summary",
      permanent: false,
    },
  };
};

export default withDefaultLayout(AnalyticsPage);
