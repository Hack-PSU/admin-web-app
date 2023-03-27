import React from "react";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { useFirebase } from "components/context";
import UnauthorizedError from "components/base/Error/UnauthorizedError";
import { DefaultLayout } from "components/layout";
import nookies from "nookies";
import { NextPageLayout } from "common/types";
import { AuthPermission } from "components/context/FirebaseProvider";

export function withProtectedRoute(
  Component: NextPage | NextPageLayout,
  permission: AuthPermission
) {
  const Page: NextPage = () => {
    const { validatePermissions } = useFirebase();

    if (validatePermissions(permission)) {
      return <Component />;
    } else {
      return <UnauthorizedError error={"Unauthorized access"} />;
    }
  };
  return Page;
}

export function withDefaultLayout<TProps>(page: NextPageLayout<TProps>) {
  page.getLayout = (page) => {
    return <DefaultLayout>{page}</DefaultLayout>;
  };

  return page;
}

export function withServerSideProps<TProps>(
  getServerSideProps?: (
    context: GetServerSidePropsContext,
    token: string
  ) =>
    | Promise<GetServerSidePropsResult<TProps>>
    | GetServerSidePropsResult<TProps>
) {
  return async (ctx: GetServerSidePropsContext) => {
    const cookies = nookies.get(ctx);

    if (cookies.idtoken) {
      if (getServerSideProps) {
        return getServerSideProps(ctx, cookies.token);
      } else {
        return {
          props: {},
        };
      }
    } else {
      return {
        redirect: {
          destination: `/login?return_to=${encodeURI(ctx.resolvedUrl)}`,
          permanent: false,
        },
      };
    }
  };
}
