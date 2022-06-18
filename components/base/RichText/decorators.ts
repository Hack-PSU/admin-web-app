import {
  CharacterMetadata,
  CompositeDecorator,
  ContentBlock,
  ContentState,
} from "draft-js";
import RichLink from "components/base/RichText/RichLink";

function findLinkEntities(
  contentBlock: ContentBlock,
  callback: any,
  contentState: ContentState
) {
  contentBlock.findEntityRanges((character: CharacterMetadata) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}

export const decorators = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: RichLink,
  },
]);
