import { FC } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Grid, styled } from "@mui/material";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorStyles from "components/base/Editor/EditorStyles";
import EditorContextMenu from "components/base/Editor/EditorContextMenu";

const EditorContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  border: `2px solid ${theme.palette.border.light}`,
  borderRadius: "15px",
  padding: theme.spacing(2, 3),
  "& .ProseMirror": {
    padding: theme.spacing(1.5, 0),
    outline: "none",
    "& p": {
      fontSize: theme.typography.pxToRem(15),
      lineHeight: theme.spacing(1),
    },
    a: {
      color: "blue",
      textDecoration: "underline",
    },
  },
}));

const Editor: FC = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        code: false,
        listItem: false,
        blockquote: false,
        bulletList: false,
        codeBlock: false,
        horizontalRule: false,
        orderedList: false,
        strike: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContainer container flexDirection={"column"}>
      <EditorStyles editor={editor} />
      <EditorContextMenu editor={editor} />
      <Grid item>
        <EditorContent editor={editor} />
      </Grid>
    </EditorContainer>
  );
};

export default Editor;
