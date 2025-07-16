import React, { FC, useEffect, useState } from "react";
import { ControlledInput, EvaIcon, LabelledInput } from "components/base";
import { Grid, IconButton, InputAdornment } from "@mui/material";
import { useRouter } from "next/router";
import { useFirebase } from "components/context";

const EyeVisible: FC = () => (
  <EvaIcon name="eye-outline" size="medium" fill="#1a1a1a" />
);

const EyeOff: FC = () => (
  <EvaIcon name="eye-off-outline" size="medium" fill="#1a1a1a" />
);

const PasswordInputAdornment: FC<{
  hidden: boolean;
  onToggleHidden(): void;
}> = ({ hidden, onToggleHidden }) => {
  return (
    <InputAdornment position={"end"}>
      <IconButton onClick={onToggleHidden} edge="end">
        {hidden ? <EyeOff /> : <EyeVisible />}
      </IconButton>
    </InputAdornment>
  );
};

const LoginForm: FC = () => {
  const [hidden, setHidden] = useState<boolean>(true);

  const onTogglePassword = () => {
    setHidden((hidden) => !hidden);
  };

  const { isAuthenticated } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // kick off to the central auth server, with your returnTo
      const returnTo = encodeURIComponent("https://admin.hackpsu.org/");
      window.location.href = `https://auth.hackpsu.org/login?returnTo=${returnTo}`;
    } else {
      // already signed in—send them on into your app
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Grid item sx={{ width: "80%" }}>
        <ControlledInput
          name="email"
          placeholder="Enter your email"
          label="Email"
          id="email"
          as={LabelledInput}
          sx={{
            width: "100%",
          }}
        />
      </Grid>
      <Grid item sx={{ width: "80%" }}>
        <ControlledInput
          name="password"
          type={hidden ? "password" : "text"}
          placeholder="Enter your password"
          autoCapitalize={"password"}
          autoCorrect={"password"}
          endAdornment={
            <PasswordInputAdornment
              hidden={hidden}
              onToggleHidden={onTogglePassword}
            />
          }
          as={LabelledInput}
          label="Password"
          id="password"
          sx={{
            width: "100%",
          }}
        />
      </Grid>
    </>
  );
};

export default LoginForm;
