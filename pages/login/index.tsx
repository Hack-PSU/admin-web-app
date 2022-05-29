import { NextPage } from "next";
import { Button, Grid, styled, Typography } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { LoginForm } from "components/login";
import { useFirebase } from "components/context";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Container = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const Login: NextPage = () => {
  const methods = useForm();
  const router = useRouter();
  const { loginWithEmailAndPassword, isAuthenticated } = useFirebase();

  const handleSubmit = () => {
    methods.handleSubmit((data) => {
      return loginWithEmailAndPassword(data.email, data.password);
    })();
    // .then(() => {
    //   return router.push("/events/new");
    // });
  };

  useEffect(() => {
    if (isAuthenticated) {
      void router.push("/events/new");
    }
  }, [router, isAuthenticated]);

  return (
    <FormProvider {...methods}>
      <Container container gap={1}>
        <Grid item>
          <Typography variant="h1">HackPSU</Typography>
        </Grid>
        <LoginForm />
        <Grid item>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Container>
    </FormProvider>
  );
};

export default Login;
