import React, { FC } from "react";
import { WithChildren } from "types/common";
import { useFirebase } from "components/context";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "./Loading";

const Root: FC<WithChildren> = ({ children }) => {
  const { isAuthenticated, isLoading } = useFirebase();
  const router = useRouter();

  const isLogin = router.pathname.startsWith("/login");

  // Show children if authenticated, on login page, or still loading
  // Only show Loading component if we know user is not authenticated and not on login page
  return (
    <Box sx={{ backgroundColor: "background.light" }}>
      {isAuthenticated || isLogin || isLoading ? children : <Loading />}
    </Box>
  );
};

export default Root;
