import { ContentState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
// import { convertToHTML } from 'draft-convert';
// import { findLinkEntities } from "components/base/RichText/decorators";

export function prepareContent(contentState: ContentState) {
  return stateToHTML(contentState, {
    inlineStyles: {
      BOLD: { element: "b" },
      ITALIC: { element: "i" },
      UNDERLINE: { element: "u" },
    },
    entityStyleFn: (entity) => {
      console.log(entity);
      const entityType = entity.getType();
      if (entityType === "LINK") {
        const data = entity.getData();
        return {
          element: "a",
          attributes: {
            href: data.url,
            rel: "noreferrer noopener",
            target: "_blank",
          },
        };
      }
    },
  });
}
