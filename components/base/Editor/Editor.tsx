import { FC, useEffect, useMemo, useId } from "react";
import { Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { alpha, Grid, styled } from "@mui/material";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import EditorStyles from "components/base/Editor/EditorStyles";
import { useController } from "react-hook-form";
import EditorContextMenu from "components/base/Editor/EditorContextMenu";
import Placeholder from "@tiptap/extension-placeholder";
import { WithControllerProps } from "components/base";

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
      lineHeight: theme.spacing(3),
      margin: 0,
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
  const editorId = useId();
  
  const extensions = useMemo(() => {
    return [
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
    ];
  }, [placeholder]);

  const editor = useEditor(
    {
      extensions,
      immediatelyRender: false,
      onCreate: ({ editor }) => {
        if (disabled) {
          editor.setEditable(false);
        }
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      content: value || "",
      enableInputRules: true,
      enablePasteRules: true,
      injectCSS: false,
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        },
      },
    },
    [extensions, onChange, disabled]
  );

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <EditorContainer key={editorId} container flexDirection={"column"}>
      {!disabled && <EditorStyles editor={editor} />}
      {!disabled && <EditorContextMenu editor={editor} />}
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
