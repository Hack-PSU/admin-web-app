import React, { FC, useState } from "react";
import { EvaIcon } from "components/base";
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  useTheme,
} from "@mui/material";
import { WithChildren } from "types/common";
import ActionButton from "./ActionButton";
import { ITableActionProps } from "./types";

interface IAccordionProps {
  title: string;
}

const StyledAccordionTitle = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
  fontWeight: 700,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
}));

const Accordion: FC<WithChildren<IAccordionProps>> = ({ children, title }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const theme = useTheme();

  return (
    <MuiAccordion
      disableGutters
      expanded={expanded}
      onChange={() => setExpanded((expanded) => !expanded)}
      sx={{
        boxShadow: 0,
        "&:before": {
          display: "none",
        },
      }}
    >
      <StyledAccordionTitle
        expandIcon={
          <Box mt={0.5}>
            <EvaIcon
              name={"chevron-right-outline"}
              size="large"
              fill={theme.palette.common.black}
            />
          </Box>
        }
      >
        {title}
      </StyledAccordionTitle>
      <AccordionDetails
        sx={{
          backgroundColor: theme.palette.button.grey,
          boxShadow: 0,
          borderBottom: "none",
        }}
      >
        {children}
      </AccordionDetails>
    </MuiAccordion>
  );
};

const FilterAction: FC<ITableActionProps> = ({ headers, names }) => {
  return (
    <ActionButton type={"filter"} title={"Filters"} icon={"funnel-outline"}>
      {names.map((state) => {
        const id = state.columnId;
        const header = headers[id];

        if (header.canFilter && state.type !== "date" && header.Filter) {
          return (
            <Accordion title={state.name} key={`${id}-filter`}>
              {header.render("Filter")}
            </Accordion>
          );
        }
      })}
    </ActionButton>
  );
};

export default FilterAction;
