import React from "react";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { useFirebase } from "components/context";
import { AuthPermission } from "types/context";
import UnauthorizedError from "components/base/Error/UnauthorizedError";
import { DefaultLayout } from "components/layout";
import { NextPageLayout } from "types/common";
import nookies from "nookies";

export function withAuthPage(Component: NextPage, permission: AuthPermission) {
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
    token: string
  ) => Promise<GetServerSidePropsResult<TProps>>
) {
  return async (ctx: GetServerSidePropsContext) => {
    const cookies = nookies.get(ctx);

    if (cookies.idtoken) {
      if (getServerSideProps) {
        return getServerSideProps(cookies.idtoken);
      } else {
        return {
          props: {},
        };
      }
    } else {
      return {
        redirect: {
          destination: `/login?from=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }
  };
}
