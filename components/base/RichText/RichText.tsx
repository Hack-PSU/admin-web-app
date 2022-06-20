import React, { FC, useCallback, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  DraftHandleValue,
  DraftEditorCommand,
} from "draft-js";
import { useController, UseControllerProps } from "react-hook-form";
import { Grid, styled, alpha } from "@mui/material";
import { decorator } from "./decorators";
import RichTextStyles from "./RichTextStyles";

interface IRichTextProps {
  placeholder: string;
  name: string;
  rules?: UseControllerProps["rules"];
  defaultValue?: UseControllerProps["defaultValue"];
}

const EditorContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: "15px",
  border: `2px solid ${theme.palette.border.light}`,
}));

const EditorInputContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1, 1),
  "& .DraftEditor-root": {
    borderRadius: "15px",
    padding: theme.spacing(1, 2),
  },
  "& .public-DraftEditor-content": {
    fontSize: "0.85rem",
    fontFamily: "Poppins",
  },
  "& .public-DraftEditorPlaceholder-inner": {
    fontSize: "0.85rem",
    fontFamily: "Poppins",
    color: alpha(theme.palette.border.dark, 0.8),
  },
}));

const RichText: FC<IRichTextProps> = ({
  name,
  rules,
  defaultValue,
  placeholder,
}) => {
  const {
    field: { onChange, onBlur, value },
  } = useController({ name, rules, defaultValue });

  const [editorState, setEditorState] = useState<EditorState>(
    value
      ? EditorState.createWithContent(value, decorator)
      : EditorState.createEmpty(decorator)
  );

  const onChangeState = useCallback(
    (editorState: EditorState) => {
      onChange(editorState.getCurrentContent());
      setEditorState(editorState);
    },
    [onChange]
  );

  const onClickBold: () => void = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  }, [editorState]);

  const onClickItalic: () => void = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  }, [editorState]);

  const onClickUnderline: () => void = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  }, [editorState]);

  const onOpenLinkPrompt: () => { show: boolean; url: string } =
    useCallback(() => {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();

      if (!selectionState.isCollapsed()) {
        // a selection is made

        // find current selection
        const startKey = selectionState.getStartKey();
        const startOffset = selectionState.getStartOffset();

        // find if current selection has an entity
        const startKeyBlock = contentState.getBlockForKey(startKey);
        const entityAtOffset = startKeyBlock.getEntityAt(startOffset);

        if (entityAtOffset) {
          const linkEntity = contentState.getEntity(entityAtOffset);
          return { url: linkEntity.getData().url, show: true };
        }
        return { show: true, url: "" };
      }
      return { show: false, url: "" };
    }, [editorState]);

  const onCreateLink: (url: string) => void = useCallback(
    (url) => {
      let link = url;

      if (!link.includes("http://")) {
        if (!link.includes("https://")) {
          link = `https://${url}`;
        }
      }

      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        "LINK",
        "IMMUTABLE",
        { url: link }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      const editorStateWithLink = EditorState.set(editorState, {
        currentContent: contentStateWithEntity,
      });

      const linkEnabledEditorState = RichUtils.toggleLink(
        editorStateWithLink,
        editorStateWithLink.getSelection(),
        entityKey
      );

      onChangeState(linkEnabledEditorState);
    },
    [editorState, onChangeState]
  );

  const onRemoveLink = useCallback(() => {
    const selectionState = editorState.getSelection();

    if (!selectionState.isCollapsed()) {
      onChangeState(RichUtils.toggleLink(editorState, selectionState, null));
    }
  }, [editorState, onChangeState]);

  const handleKeyCommand: (
    command: DraftEditorCommand,
    editorState: EditorState
  ) => DraftHandleValue = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  return (
    <EditorContainer container flexDirection="column">
      <RichTextStyles
        onClickBold={onClickBold}
        onClickItalic={onClickItalic}
        onClickUnderline={onClickUnderline}
        onClickOpenLinkPrompt={onOpenLinkPrompt}
        onClickCreateLink={onCreateLink}
        onRemoveLink={onRemoveLink}
      />
      <EditorInputContainer item>
        <Editor
          onBlur={onBlur}
          editorState={editorState}
          onChange={onChangeState}
          placeholder={placeholder}
          handleKeyCommand={handleKeyCommand}
        />
      </EditorInputContainer>
    </EditorContainer>
  );
};

export default RichText;
