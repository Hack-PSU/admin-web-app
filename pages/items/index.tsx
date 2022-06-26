import React, { useEffect } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";

const ItemsPage: NextPage = () => {
  return <></>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/items/manage",
      permanent: false,
    },
  };
};

export default withDefaultLayout(ItemsPage);
