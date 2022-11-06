import React, { FC, useCallback } from "react";
import { UseScoreResultsReturn } from "components/judging";
import { Box, Grid, Typography } from "@mui/material";
import { RenderSubRows, Table, useColumnDef, useTable } from "components/Table";
import ScoreBreakdown from "components/judging/scores/ScoreBreakdown";
import { EvaIcon } from "components/base";

type AllScoresSectionProps = Pick<UseScoreResultsReturn, "allData"> & {
  refetch(): void;
};
type AllScoresEntity = AllScoresSectionProps["allData"][number];

const formatScore = (value: unknown) => Number(value).toFixed(2);

const AllScoresSection: FC<AllScoresSectionProps> = ({ allData, refetch }) => {
  const defs = useColumnDef<AllScoresEntity>({
    columns: [
      {
        id: "project",
        type: "text",
        header: "Project",
        accessorKey: "projectName",
      },
      {
        id: "average",
        type: "text",
        header: "Avg..",
        format: formatScore,
        accessorKey: "average",
      },
      {
        id: "creativity",
        type: "text",
        header: "Crea..",
        format: formatScore,
        accessorKey: "creativity",
      },
      {
        id: "implementation",
        type: "text",
        header: "Imple..",
        format: formatScore,
        accessorKey: "implementation",
      },
      {
        id: "growth",
        type: "text",
        header: "Growth",
        format: formatScore,
        accessorKey: "growth",
      },
      {
        id: "clarity",
        type: "text",
        header: "Clarity",
        format: formatScore,
        accessorKey: "clarity",
      },
      {
        id: "technical",
        type: "text",
        header: "Tech..",
        format: formatScore,
        accessorKey: "technical",
      },
      {
        id: "humanitarian",
        type: "text",
        header: "Ener..",
        format: formatScore,
        accessorKey: "energy",
      },
      {
        id: "supply_chain",
        type: "text",
        header: "Sup..",
        format: formatScore,
        accessorKey: "supply_chain",
      },
      {
        id: "environmental",
        type: "text",
        header: "Env..",
        format: formatScore,
        accessorKey: "environmental",
      },
    ],
  });

  const renderSubRows: RenderSubRows<AllScoresEntity> = useCallback(
    (row) => <ScoreBreakdown row={row} />,
    []
  );

  const table = useTable({
    data: allData,
    useExpanded: true,
    renderSubRows,
    ...defs,
  });

  const onRefresh = () => {
    return null;
  };

  const onDelete = () => {
    return null;
  };

  return (
    <>
      <Grid item>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          All Scores
        </Typography>
      </Grid>
      <Grid container item alignItems="center" spacing={1}>
        <Grid item>
          <Box mt={0.3}>
            <EvaIcon name={"alert-circle-outline"} />
          </Box>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            Expand each row to see score breakdowns
          </Typography>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "100%" }}>
        <Table {...table}>
          <Table.GlobalActions>
            <Table.GlobalRefresh onRefresh={refetch} />
            <Table.GlobalPageSize />
          </Table.GlobalActions>
          <Table.Container>
            <Table.Actions
              center={<Table.PaginationAction />}
              right={<Table.DeleteAction onDelete={onDelete} />}
            />
            <Table.Content>
              <Table.Header />
              <Table.Body />
            </Table.Content>
          </Table.Container>
        </Table>
      </Grid>
    </>
  );
};

export default AllScoresSection;
