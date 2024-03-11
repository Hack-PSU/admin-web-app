import React, { FC, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { RenderSubRows, Table, useColumnDef, useTable } from "components/Table";
import ScoreBreakdown from "components/judging/scores/ScoreBreakdown";
import { EvaIcon } from "components/base";
import { ProjectBreakdownEntity } from "api";

type AllScoresSectionProps = {
  refetch(): void;
  data: ProjectBreakdownEntity[];
};
type AllScoresEntity = ProjectBreakdownEntity;

const formatScore = (value: unknown) => Number(value).toFixed(2);

const AllScoresSection: FC<AllScoresSectionProps> = ({ data, refetch }) => {
  const defs = useColumnDef<AllScoresEntity>({
    columns: [
      {
        id: "project",
        type: "text",
        header: "Project",
        accessorKey: "name",
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
        id: "sustainability",
        type: "text",
        header: "Sustain..",
        format: formatScore,
        accessorKey: "challenge1",
      },
      {
        id: "entrepreneurship",
        type: "text",
        header: "Entre..",
        format: formatScore,
        accessorKey: "challenge2",
      },
      {
        id: "generative_ai",
        type: "text",
        header: "AI..",
        format: formatScore,
        accessorKey: "challenge3",
      },
    ],
  });

  const renderSubRows: RenderSubRows<AllScoresEntity> = useCallback(
    (row) => <ScoreBreakdown row={row} />,
    []
  );

  const table = useTable({
    data,
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
