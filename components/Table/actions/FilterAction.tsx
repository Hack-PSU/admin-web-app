import React, { FC, useState } from "react";
import { Button, EvaIcon } from "components/base";
import {
  Accordion as MuiAccordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Popover,
  styled,
  useTheme,
} from "@mui/material";
import { Column, ColumnInstance, HeaderGroup } from "react-table";
import { NamesState } from "types/hooks";
import { WithChildren } from "types/common";

interface IFilterActionProps {
  headers: { [p: string]: ColumnInstance<object> };
  names: NamesState[];
}

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

const FilterAction: FC<IFilterActionProps> = ({ headers, names }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const id = open ? "filter-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-describedby={id}
        startIcon={
          <Box pt={0.5}>
            <EvaIcon name={"funnel-outline"} size="large" fill="#1a1a1a" />
          </Box>
        }
        sx={{
          lineHeight: "1.5rem",
          alignItems: "center",
          borderRadius: "10px",
          padding: theme.spacing(0.5, 2),
        }}
        onClick={handleClick}
      >
        Filters
      </Button>
      <Popover
        id={id}
        open={open}
        keepMounted
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            boxShadow: 1,
            borderRadius: "10px",
            width: 350,
          },
        }}
      >
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
      </Popover>
    </>
  );
};

export default FilterAction;
