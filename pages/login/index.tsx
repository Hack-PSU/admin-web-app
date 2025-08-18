import { NextPage } from "next";
import { Grid, styled, Typography } from "@mui/material";
import { useFirebase } from "components/context";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "assets/images/logo.svg";

const Container = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: theme.palette.background.light,
}));

const LoginContainer = styled(Grid)(({ theme }) => ({
  width: "35%",
  boxShadow: theme.shadows[2],
  backgroundColor: "common.white",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(5, 2),
  borderRadius: "10px",
}));

const Login: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useFirebase();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Wait for authentication state to be initialized
    if (isLoading) return;

    if (isAuthenticated) {
      const { return_to } = router.query;
      if (return_to) {
        void router.push(String(return_to));
      } else {
        void router.push("/hackers");
      }
      return;
    }

    const timer = setTimeout(() => {
      const returnTo = encodeURIComponent("https://admin.hackpsu.org/");
      window.location.href = `https://auth.hackpsu.org/login?returnTo=${returnTo}`;
    }, 3000);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [router, isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <Container container>
        <LoginContainer container item gap={3}>
          <Grid item>
            <Image src={Logo} width={120} height={120} alt="hackpsu-logo" />
          </Grid>
          <Grid item>
            <Typography variant="h5" align="center" gutterBottom>
              Loading...
            </Typography>
          </Grid>
        </LoginContainer>
      </Container>
    );
  }

  return (
    <Container container>
      <LoginContainer container item gap={3}>
        <Grid item>
          <Image src={Logo} width={120} height={120} alt="hackpsu-logo" />
        </Grid>
        <Grid item>
          <Typography variant="h5" align="center" gutterBottom>
            You will be redirected soon...
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            Redirecting to auth.hackpsu.org in {countdown} seconds
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" align="center" color="text.secondary">
            If you are not redirected automatically, please{" "}
            <a 
              href="https://auth.hackpsu.org" 
              style={{ color: "#d32f2f", textDecoration: "none" }}
            >
              click here to login manually
            </a>
          </Typography>
        </Grid>
      </LoginContainer>
    </Container>
  );
};

export default Login;
