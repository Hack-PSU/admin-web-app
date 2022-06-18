import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  DraftHandleValue,
  DraftEditorCommand,
  Modifier,
} from "draft-js";
import { useFormContext } from "react-hook-form";
import { Grid, lighten, styled, IconButton, useTheme } from "@mui/material";
import { Button, EvaIcon } from "components/base";
import { decorators } from "./decorators";
import RichTextStyles from "components/base/RichText/RichTextStyles";

interface IRichTextProps {
  placeholder: string;
  name: string;
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
}));

const RichText: FC<IRichTextProps> = ({ name, placeholder }) => {
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty(decorators)
  );
  const { setValue, register } = useFormContext();

  const [selectedUrl, setSelectedUrl] = useState<string>("");

  const onChangeState = useCallback((editorState: EditorState) => {
    setValue(name, editorState);
    setEditorState(editorState);
  }, []);

  useEffect(() => {
    register(name);
  }, []);

  const onClickBold = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  }, [editorState]);

  const onClickItalic = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  }, [editorState]);

  const onClickUnderline = useCallback(() => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  }, [editorState]);

  const onOpenLinkPrompt = useCallback(() => {
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
        setSelectedUrl(linkEntity.getData().url);
      }
    }
  }, [editorState]);

  const onCreateLink = useCallback(
    (url: string) => {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();

      const contentStateWithEntity = contentState.createEntity(
        "LINK",
        "MUTABLE",
        { url }
      );

      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const contentStateWithLink = Modifier.applyEntity(
        contentState,
        selectionState,
        entityKey
      );

      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithLink,
      });

      setEditorState(newEditorState);
    },
    [editorState]
  );

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
        urlData={selectedUrl}
      />
      <EditorInputContainer item>
        <Editor
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
