import { NextPage } from "next";
import { darken, Grid, styled, Typography, useTheme } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { LoginForm } from "components/login";
import { useFirebase } from "components/context";
import { Button } from "components/base";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import Logo from "assets/images/logo.svg";

const Container = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "80vh",
}));

const LoginContainer = styled(Grid)(({ theme }) => ({
  width: "35%",
  boxShadow: theme.shadows[1],
  backgroundColor: "common.white",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(5, 2),
  borderRadius: "10px",
}));

const Login: NextPage = () => {
  const theme = useTheme();
  const methods = useForm();
  const router = useRouter();
  const { loginWithEmailAndPassword, isAuthenticated } = useFirebase();

  const handleSubmit = () => {
    methods.handleSubmit((data) => {
      return loginWithEmailAndPassword(data.email, data.password);
    })();
  };

  useEffect(() => {
    if (isAuthenticated) {
      const { return_to } = router.query;
      if (return_to) {
        void router.push(String(return_to));
      } else {
        void router.push("/");
      }
    }
  }, [router, isAuthenticated]);

  return (
    <FormProvider {...methods}>
      <Container container>
        <LoginContainer container item gap={1.5}>
          <Grid item>
            <Image src={Logo} width={120} height={120} alt="hackpsu-logo" />
          </Grid>
          <LoginForm />
          <Grid item sx={{ width: "80%" }}>
            <Button
              onClick={handleSubmit}
              sx={{
                mt: 1.5,
                lineHeight: "1.5rem",
                padding: theme.spacing(1.5, 2),
                width: "100%",
                backgroundColor: "error.main",
                ":hover": {
                  backgroundColor: darken(theme.palette.error.main, 0.1),
                },
              }}
              textProps={{
                sx: {
                  color: "common.white",
                },
              }}
            >
              Submit
            </Button>
          </Grid>
        </LoginContainer>
      </Container>
    </FormProvider>
  );
};

export default Login;
