import React, { FC } from "react";
import { InputLabel } from "components/base";
import { Typography } from "@mui/material";

interface IEventDetailProps {
  label: string;
  detail: string;
}

const EventDetail: FC<IEventDetailProps> = ({ label, detail }) => {
  return (
    <>
      <Typography variant="body1" sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "0.85rem", mt: 0.2 }}>
        {detail}
      </Typography>
    </>
  );
};

export default EventDetail;
