import React, { FC, useCallback, useState } from "react";
import { Editor } from "@tiptap/core";
import { darken, Grid, Popover, styled, useTheme } from "@mui/material";
import { Button, EvaIcon, LabelledInput } from "components/base";
import StylesButton from "components/base/Editor/StylesButton";
import {
  Bold,
  Italic,
  Redo2,
  RemoveFormatting,
  Trash2,
  Underline,
  Undo2,
} from "lucide-react";

type Props = {
  editor: Editor;
};

const StylesContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(0.6, 0),
}));

const EditorStyles: FC<Props> = ({ editor }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [url, setUrl] = useState<string>("");

  const handleOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const previousUrl = editor.getAttributes("link").href;

      setUrl(previousUrl);
      setAnchorEl(event.currentTarget);
    },
    [editor]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setUrl("");
  }, []);

  const handleUnset = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    handleClose();
  }, [editor, handleClose]);

  const handleConfirm = useCallback(() => {
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    handleClose();
  }, [editor, handleClose, url]);

  const open = Boolean(anchorEl);
  const id = open ? "create-link-popover" : undefined;

  return (
    <StylesContainer container item justifyContent={"space-between"}>
      <Grid container item spacing={1.5}>
        <Grid item>
          <StylesButton
            disableElevation
            disableRipple
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold
              stroke={theme.palette.common.black}
              size={18}
              style={{ marginTop: "3px" }}
            />
          </StylesButton>
        </Grid>
        <Grid item>
          <StylesButton
            disableElevation
            disableRipple
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic
              stroke={theme.palette.common.black}
              size={18}
              style={{ marginTop: "3px" }}
            />
          </StylesButton>
        </Grid>
        <Grid item>
          <StylesButton
            disableElevation
            disableRipple
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline
              stroke={theme.palette.common.black}
              size={18}
              style={{ marginTop: "3px" }}
            />
          </StylesButton>
        </Grid>
        <Grid item>
          <StylesButton
            disableRipple
            disableElevation
            isActive={false}
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            <RemoveFormatting
              fill={theme.palette.common.black}
              size={18}
              style={{ marginTop: "3px" }}
            />
          </StylesButton>
        </Grid>
        <Grid item>
          <StylesButton
            disableRipple
            disableElevation
            isActive={editor.isActive("link")}
            onClick={handleOpen}
          >
            <EvaIcon
              name={"link-2"}
              size={"medium"}
              style={{ marginTop: "3px", transform: "scale(0.95)" }}
              fill={theme.palette.common.black}
            />
          </StylesButton>
        </Grid>
        <Grid item>
          <StylesButton
            isActive={false}
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2
              stroke={
                editor.can().undo()
                  ? theme.palette.common.black
                  : theme.palette.border.light
              }
              size={18}
              style={{ marginTop: "3px" }}
            />
          </StylesButton>
        </Grid>
        <Grid item>
          <StylesButton
            isActive={false}
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2
              stroke={
                editor.can().redo()
                  ? theme.palette.common.black
                  : theme.palette.border.light
              }
              size={18}
              style={{ marginTop: "3px" }}
            />
          </StylesButton>
        </Grid>
        <Grid item>
          <StylesButton
            isActive={false}
            disabled={!editor.can().clearContent()}
            onClick={() => editor.chain().focus().clearContent().run()}
          >
            <Trash2
              stroke={
                editor.can().clearContent()
                  ? theme.palette.error.light
                  : theme.palette.border.light
              }
              size={18}
              style={{ marginTop: "3px" }}
            />
          </StylesButton>
        </Grid>
      </Grid>
      <Popover
        disablePortal
        id={id}
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            boxShadow: 2,
            borderRadius: "15px",
            width: "30%",
          },
        }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems={"center"}
          sx={{
            padding: theme.spacing(1, 2),
            width: "100%",
          }}
          flexDirection={"column"}
          gap={1.5}
        >
          <Grid item sx={{ width: "100%" }}>
            <LabelledInput
              placeholder={"Enter a URL"}
              id={"rich-text-url"}
              label={"URL"}
              onChange={(e) => setUrl(e.currentTarget.value)}
              value={url}
              sx={{
                width: "100%",
              }}
            />
          </Grid>
          <Grid container item justifyContent={"center"}>
            <Grid item>
              <Button
                onClick={handleUnset}
                sx={{
                  backgroundColor: "error.main",
                  ":hover": {
                    backgroundColor: darken(theme.palette.error.main, 0.1),
                  },
                }}
                textProps={{
                  sx: {
                    color: "common.white",
                  },
                }}
              >
                Remove
              </Button>
            </Grid>
            <Grid item sx={{ ml: 2 }}>
              <Button onClick={handleConfirm}>Confirm</Button>
            </Grid>
          </Grid>
        </Grid>
      </Popover>
    </StylesContainer>
  );
};

export default EditorStyles;
