import { FC } from "react";
import { Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { alpha, Grid, styled } from "@mui/material";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorStyles from "components/base/Editor/EditorStyles";
import { useController } from "react-hook-form";
import { WithControllerProps } from "types/components";
import EditorContextMenu from "components/base/Editor/EditorContextMenu";
import Placeholder from "@tiptap/extension-placeholder";

type Props = {
  onChange(newValue: string): void;
  value: Content;
  placeholder: string;
  disabled?: boolean;
};

type ControlledEditorProps = WithControllerProps<
  Omit<Props, "value" | "onChange">
>;

const EditorContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  border: `2px solid ${theme.palette.border.light}`,
  borderRadius: "15px",
  padding: theme.spacing(1, 2),
  "& .ProseMirror": {
    padding: theme.spacing(1.5, 0),
    outline: "none",
    "& p": {
      fontSize: theme.typography.pxToRem(15),
      lineHeight: theme.spacing(1),
      "&.is-editor-empty:first-child::before": {
        outline: "none",
        color: alpha(theme.palette.border.dark, 0.8),
        content: "attr(data-placeholder)",
        float: "left",
        height: 0,
        pointerEvent: "none",
      },
    },
    "& a": {
      color: "blue",
      textDecoration: "underline",
    },
  },
}));

const Editor: FC<Props> = ({ onChange, value, placeholder, disabled }) => {
  const editor = useEditor(
    {
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
        Placeholder.configure({
          emptyEditorClass: "is-editor-empty",
          placeholder,
        }),
      ],
      onCreate: ({ editor }) => {
        if (disabled) {
          editor.setEditable(false);
        }
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      content: value,
    },
    [placeholder, onChange, disabled]
  );

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

export const ControlledEditor: FC<ControlledEditorProps> = ({
  disabled,
  placeholder,
  name,
  rules,
  defaultValue,
}) => {
  const {
    field: { onChange, value },
  } = useController({ name, rules, defaultValue });

  return (
    <Editor
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default Editor;
