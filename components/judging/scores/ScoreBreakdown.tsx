import { FC, useMemo } from "react";
import {
  lighten,
  Table as MuiTable,
  TableBody,
  TableContainer,
  TableHead,
  useTheme,
} from "@mui/material";
import {
  DefaultHeaderCell,
  DefaultRow,
  DefaultTextCell,
} from "components/Table";
import _ from "lodash";
import { ProjectBreakdownEntity } from "api";

type AllScoresEntity = ProjectBreakdownEntity;

interface IScoreBreakdownProps {
  row: AllScoresEntity;
}

const BreakdownHeader: FC<{ header: string; score?: boolean }> = ({
  header,
  score = false,
}) => {
  const theme = useTheme();

  return (
    <DefaultHeaderCell
      cellProps={{
        disableDefault: true,
        sx: {
          width: score ? "8%" : undefined,
          padding: theme.spacing(1, 1.5, 1, 0),
        },
      }}
    >
      {header}
    </DefaultHeaderCell>
  );
};

const BreakdownCell: FC<{ score: string }> = ({ score }) => (
  <DefaultTextCell
    cellProps={{
      disableDefault: true,
    }}
  >
    {score}
  </DefaultTextCell>
);

const ScoreBreakdown: FC<IScoreBreakdownProps> = ({ row }) => {
  const theme = useTheme();

  const breakdown = useMemo(() => row.scores, [row]);

  return (
    <TableContainer
      sx={{
        padding: theme.spacing(1, 2, 1.5),
        width: "100%",
      }}
    >
      <MuiTable sx={{ width: "100%" }}>
        <TableHead>
          <DefaultRow
            sx={{
              backgroundColor: lighten(theme.palette.border.light, 0.6),
            }}
          >
            <BreakdownHeader header={"Judge"} />
            <BreakdownHeader header={"Total"} score />
            <BreakdownHeader header={"Creativity"} score />
            <BreakdownHeader header={"Implementation"} score />
            <BreakdownHeader header={"Growth"} score />
            <BreakdownHeader header={"Clarity"} score />
            <BreakdownHeader header={"Technical"} score />
            <BreakdownHeader header={"Energy"} score />
            <BreakdownHeader header={"Supply Chain"} score />
            <BreakdownHeader header={"Environmental"} score />
          </DefaultRow>
        </TableHead>
        <TableBody>
          {breakdown.map((data, index) => {
            const {
              judge,
              creativity,
              implementation,
              growth,
              clarity,
              technical,
              energy,
              supplyChain,
              environmental,
            } = data;

            const average = _.sum([
              creativity,
              implementation,
              growth,
              clarity,
              technical,
            ]);

            const format = (value: number) => value.toFixed(2);

            return (
              <DefaultRow
                key={`${row.name}-${judge.firstName}-${judge.lastName}-${index}`}
                sx={{
                  ":nth-child(even)": {
                    backgroundColor: lighten(theme.palette.border.light, 0.6),
                  },
                }}
              >
                <BreakdownCell score={`${judge.firstName} ${judge.lastName}`} />
                <BreakdownCell score={format(average)} />
                <BreakdownCell score={format(creativity)} />
                <BreakdownCell score={format(implementation)} />
                <BreakdownCell score={format(growth)} />
                <BreakdownCell score={format(clarity)} />
                <BreakdownCell score={format(technical)} />
                <BreakdownCell score={format(energy ?? 0)} />
                <BreakdownCell score={format(supplyChain ?? 0)} />
                <BreakdownCell score={format(environmental ?? 0)} />
              </DefaultRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default ScoreBreakdown;
