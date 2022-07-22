import React from "react";
import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";

const JudgingPage: NextPage = () => {
  return <></>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/judging/scores",
      permanent: false,
    },
  };
};

export default withDefaultLayout(JudgingPage);
