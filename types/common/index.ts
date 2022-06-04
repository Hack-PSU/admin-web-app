import React from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";

export type WithChildren<T = {}> = T & {
  children?: React.ReactNode;
};

export type NextPageLayout<TProps = any> = NextPage<TProps> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type AppPropsLayout = AppProps & {
  Component: NextPageLayout;
};
