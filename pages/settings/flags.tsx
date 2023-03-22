import React, { FC, useCallback, useMemo } from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { withSettingsLayout } from "components/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateEntity,
  fetch,
  getAllAppFlags,
  QueryKeys,
  toggleFlag,
  ToggleFlagEntity,
} from "api";
import { useSnackbar } from "notistack";
import { Button, EvaIcon, Loading } from "components/base";

const SettingsFlags: FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  const { data: flagEnabledMap, isLoading } = useQuery(
    QueryKeys.flag.findAll(),
    () => fetch(getAllAppFlags),
    {
      select: (data) => {
        if (data) {
          return data.reduce((acc, curr) => {
            acc[curr.name] = curr.isEnabled;
            return acc;
          }, {} as { [key: string]: boolean });
        }
      },
    }
  );

  const { mutateAsync: mutateAppFlags } = useMutation(
    ({ entity }: CreateEntity<ToggleFlagEntity, "">) => toggleFlag(entity),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.flag.all);
        enqueueSnackbar("Successfully updated app flags", {
          variant: "success",
        });
      },
    }
  );

  // const { mutateAsync: mutatePushJudging } = useMutation(
  //   ({ entity }: CreateEntity<IWSPushJudgingEntity, "">) =>
  //     pushJudgingFlag(entity),
  //   {
  //     onSuccess: () => {
  //       enqueueSnackbar("Successfully notified clients", {
  //         variant: "success",
  //       });
  //     },
  //   }
  // );

  const isJudgingEnabled = useMemo(() => {
    return Boolean(flagEnabledMap && flagEnabledMap["judging"]);
  }, [flagEnabledMap]);

  const onClickToggleJudging = useCallback(
    (shouldEnable: boolean) => {
      return async () => {
        await mutateAppFlags({
          entity: {
            name: "judging",
            isEnabled: shouldEnable,
          },
        });
        // await mutatePushJudging({
        //   entity: {
        //     to: "ADMIN",
        //     data: {
        //       isEnabled: shouldEnable,
        //     },
        //   },
        // });
      };
    },
    [mutateAppFlags]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Grid item xs={4}>
      <Grid
        container
        sx={{
          backgroundColor: "common.white",
          boxShadow: 2,
          borderRadius: "10px",
          px: 1.5,
          py: 2,
        }}
        flexDirection={"column"}
        gap={1.5}
      >
        <Grid container item alignItems={"center"}>
          <Grid
            container
            item
            sx={{
              background: theme.palette.gradient.angled.accent,
              borderRadius: "5px",
              alignItems: "center",
              justifyContent: "center",
              width: 35,
              height: 35,
              minWidth: 0,
              mr: 2,
            }}
          >
            <Box pt={0.5}>
              <EvaIcon
                name={"flag-outline"}
                fill={theme.palette.common.white}
                size={"large"}
              />
            </Box>
          </Grid>
          <Grid item>
            <Typography
              variant={"h6"}
              sx={{
                fontWeight: 600,
              }}
            >
              Judging Flag
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            variant={"body1"}
            sx={{
              fontSize: "0.8rem",
              fontWeight: 500,
            }}
          >
            Toggling the judging flag will either enable or disable the ability
            for organizers to enter judging scores
          </Typography>
        </Grid>
        <Button
          sx={{
            px: 2,
            py: 1,
            borderRadius: "5px",
          }}
          onClick={
            isJudgingEnabled
              ? onClickToggleJudging(false)
              : onClickToggleJudging(true)
          }
        >
          {isJudgingEnabled ? "Disable Judging" : "Enable Judging"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default withSettingsLayout(SettingsFlags);
