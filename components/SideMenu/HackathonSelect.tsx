import React, { FC, useCallback } from "react";
import { useTheme } from "@mui/system";
import { BaseMenuItem, Select } from "components/base";
import { ISelectProps } from "types/components";
import { Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const HackathonSelect: FC<ISelectProps> = ({ ...props }) => {
  const theme = useTheme();
  const router = useRouter();

  const onClickRoute = useCallback(
    (route: string) => {
      void router.push(route);
    },
    [router]
  );

  return (
    <Select
      sx={{
        border: "none",
        padding: theme.spacing(1, 2),
        width: "90%",
      }}
      inputProps={{
        style: {
          fontWeight: "bold",
          fontSize: "1.2rem",
        },
      }}
      menuWidth={"15%"}
      renderItem={({ item, index, onChange }) => {
        return (
          <BaseMenuItem
            item={item}
            onChangeItem={onChange}
            onClickOverride={() => onClickRoute(item.value)}
            key={`${item.display}-${index}`}
          >
            <Link href={item.value}>{item.display}</Link>
          </BaseMenuItem>
        );
      }}
      {...props}
    />
  );
};

export default HackathonSelect;
