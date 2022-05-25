import React, { useEffect } from "react";
import {NextPage} from "next";
import { useFirebase } from 'components/context'
import { AuthPermission } from 'types/context'
import {Error} from "components/base";


export function withAuthPage(Component: NextPage, permission: AuthPermission) {
  const Page: NextPage = () => {
    const { validatePermissions } = useFirebase()

    if (validatePermissions(permission)) {
      return <Component />
    } else {
      return <Error />
    }
  }
  return Page
}