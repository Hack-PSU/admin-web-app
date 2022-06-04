import React, { FC } from "react";

// @ts-ignore (no types available for this package)
import EvaBaseIcon from "react-eva-icons";

interface IEvaIcon {
  name: string;
  size?: "small" | "medium" | "large" | "xlarge";
  fill?: string;
  style?: React.CSSProperties;
}

const EvaIcon: FC<IEvaIcon> = ({ name, size, fill, style }) => {
  return (
    <div key={`${name}-${size ?? ""}-${fill ?? ""}`} style={style}>
      <EvaBaseIcon name={name} fill={fill} size={size} />
    </div>
  );
};

export default EvaIcon;
