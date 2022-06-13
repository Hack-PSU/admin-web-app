import React, { FC } from "react";
import { alpha, Box, Grid, styled, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { EvaIcon } from "components/base";

interface IOptionProps {
  to: string;
  icon: string;
  option: string;
}

const OptionLink = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(20),
  color: "common.black",
  transition: "opacity 200ms ease-in-out",
  ":hover": {
    opacity: 1,
  },
  fontFamily: "Poppins",
  fontWeight: 600,
}));

const Option: FC<IOptionProps> = ({ to, icon, option }) => {
  const theme = useTheme();
  const router = useRouter();

  const isActive = to === router.pathname || router.pathname.includes(to);

  return (
    <Link href={to} passHref>
      <Grid
        container
        item
        alignItems="center"
        spacing={2}
        sx={{
          cursor: "pointer",
        }}
      >
        <Grid item>
          <Box mt={0.5}>
            <EvaIcon
              name={icon}
              size="large"
              fill={
                isActive
                  ? theme.palette.common.black
                  : alpha(theme.palette.common.black, 0.4)
              }
            />
          </Box>
        </Grid>
        <Grid item>
          <OptionLink
            as={"a"}
            variant="body1"
            sx={{
              opacity: isActive ? 1 : 0.3,
            }}
          >
            {option}
          </OptionLink>
        </Grid>
      </Grid>
    </Link>
  );
};

export default Option;
