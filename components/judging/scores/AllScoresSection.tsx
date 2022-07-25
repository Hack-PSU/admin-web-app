import React, { FC } from "react";
import { UseScoreResultsReturn } from "components/judging";
import { Grid, Typography } from "@mui/material";
import { Table, useColumnDef, useTable } from "components/Table";

type AllScoresSectionProps = Pick<UseScoreResultsReturn, "allData">;

const formatScore = (value: unknown) => Number(value).toFixed(2);

const AllScoresSection: FC<AllScoresSectionProps> = ({ allData }) => {
  const defs = useColumnDef<AllScoresSectionProps["allData"][number]>({
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
        // size: 20,
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
        header: "Hum..",
        format: formatScore,
        accessorKey: "humanitarian",
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

  const table = useTable({
    data: allData,
    useExpanded: true,
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
      <Grid item sx={{ width: "100%" }}>
        <Table {...table}>
          <Table.GlobalActions>
            <Table.GlobalRefresh onRefresh={onRefresh} />
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
