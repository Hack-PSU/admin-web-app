import React, { FC, useCallback, useState } from "react";
import { ControlledInput, EvaIcon } from "components/base";
import { Grid, IconButton, InputAdornment } from "@mui/material";

const EyeVisible: FC = () => (
  <EvaIcon name="eye-outline" size="medium" fill="#000000" />
);

const EyeOff: FC = () => (
  <EvaIcon name="eye-off-outline" size="medium" fill="#000000" />
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

  return (
    <>
      <Grid item>
        <ControlledInput name="email" placeholder="Enter your email" />
      </Grid>
      <Grid item>
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
        />
      </Grid>
    </>
  );
};

export default LoginForm;
