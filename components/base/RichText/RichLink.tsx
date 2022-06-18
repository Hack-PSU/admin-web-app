import { FC } from "react";
import { Link } from "@mui/material";

// Get props type from https://github.com/facebook/draft-js/blob/main/src/model/decorators/DraftDecorator.js
const RichLink: FC = (props: any) => {
  const { contentState, entityKey, decoratedText } = props;
  const url = contentState.getEntity(entityKey).getData().url;

  return (
    <Link href={url} rel="noreferrer noopener" target="_blank">
      {decoratedText}
    </Link>
  );
};

export default RichLink;
