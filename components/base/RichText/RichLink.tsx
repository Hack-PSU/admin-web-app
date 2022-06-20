import { FC } from "react";
import { Link } from "@mui/material";

// Get props type from https://github.com/facebook/draft-js/blob/main/src/model/decorators/DraftDecorator.js
const RichLink: FC = (props: any) => {
  const url = props.contentState.getEntity(props.entityKey).getData().url;
  return (
    <a href={url} style={{ textDecoration: "underline", color: "blue" }}>
      {props.children}
    </a>
  );
};

export default RichLink;
