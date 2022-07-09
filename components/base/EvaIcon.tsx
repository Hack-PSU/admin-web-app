import React, { FC } from "react";

// @ts-ignore (no types available for this package)
import EvaBaseIcon from "react-eva-icons";
import { useTheme } from "@mui/material";

interface IEvaIcon {
  name: string;
  size?: "small" | "medium" | "large" | "xlarge";
  fill?: string;
  style?: React.CSSProperties;
}

const EvaIcon: FC<IEvaIcon> = ({ name, size, fill, style }) => {
  const theme = useTheme();

  return (
    <div key={`${name}-${size ?? ""}-${fill ?? ""}`} style={style}>
      <EvaBaseIcon
        name={name}
        fill={fill ?? theme.palette.common.black}
        size={size ?? "medium"}
      />
    </div>
  );
};

export default EvaIcon;
