import React, { FC } from "react";
import { WithChildren } from "types/common";
import { useFirebase } from "api/providers/FirebaseProvider";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "./Loading";

const Root: FC<WithChildren> = ({ children }) => {
  const { isAuthenticated } = useFirebase();
  const router = useRouter();

  const isLogin = router.pathname.startsWith("/login");

  return (
    <Box sx={{ backgroundColor: "background.light" }}>
      {isAuthenticated || isLogin ? children : <Loading />}
    </Box>
  );
};

export default Root;
