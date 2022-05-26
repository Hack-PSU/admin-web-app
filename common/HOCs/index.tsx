import React from "react";
import {NextPage} from "next";
import { useFirebase } from 'components/context';
import { AuthPermission } from 'types/context';
import UnauthorizedError from "components/base/Error/UnauthorizedError";

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