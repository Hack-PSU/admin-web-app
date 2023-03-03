import { FC } from "react";
import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import { ButtonGroup, lighten, styled, useTheme } from "@mui/material";
import BaseStylesButton from "components/base/Editor/StylesButton";

type Props = {
  editor: Editor;
};

const StylesButton = styled(BaseStylesButton)(({ theme, isActive }) => ({
  border: "none",
  backgroundColor: !isActive
    ? theme.palette.common.white
    : lighten(theme.palette.common.black, 0.9),
  ":hover": {
    border: "none",
    backgroundColor: !isActive
      ? lighten(theme.palette.common.black, 0.95)
      : lighten(theme.palette.common.black, 0.9),
  },
}));

const EditorContextMenu: FC<Props> = ({ editor }) => {
  const theme = useTheme();

  return (
    <BubbleMenu editor={editor}>
      <ButtonGroup
        sx={{
          border: `1px solid ${theme.palette.common.black}`,
        }}
      >
        <StylesButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </StylesButton>
        <StylesButton
          isActive={editor.isActive("italic")}
          textProps={{
            sx: {
              fontStyle: "italic",
            },
          }}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </StylesButton>
        <StylesButton
          isActive={editor.isActive("underline")}
          textProps={{
            sx: {
              textDecoration: "underline",
              textUnderlineOffset: "1px",
            },
          }}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </StylesButton>
      </ButtonGroup>
    </BubbleMenu>
  );
};

export default EditorContextMenu;
