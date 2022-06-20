import React, { FC } from "react";

// Get props type from https://github.com/facebook/draft-js/blob/main/src/model/decorators/DraftDecorator.js
const RichLink: FC = (props: any) => {
  const url = props.contentState.getEntity(props.entityKey).getData().url;
  return (
    <a
      href={url}
      style={{ textDecoration: "underline", color: "blue" }}
      rel="noreferrer noopener"
      target="_blank"
    >
      {props.children}
    </a>
  );
};

export default RichLink;
