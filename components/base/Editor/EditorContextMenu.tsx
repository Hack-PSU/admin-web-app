import { FC, useMemo } from "react";
import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import { darken, Grid, lighten, styled, useTheme } from "@mui/material";
import BaseStylesButton from "components/base/Editor/StylesButton";
import { Unlink } from "lucide-react";

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

const MenuContainer = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  borderRadius: "5px",
  padding: theme.spacing(0.8),
}));

const EditorContextMenu: FC<Props> = ({ editor }) => {
  const theme = useTheme();

  const bubbleMenu = useMemo(() => (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive("link")}
      tippyOptions={{ duration: 100 }}
    >
      <MenuContainer container>
        <Grid item>
          <StylesButton
            isActive={false}
            disabled={!editor.isActive("link")}
            onClick={() => editor.chain().focus().unsetLink().run()}
            sx={{
              backgroundColor: "transparent",
              ":hover": {
                backgroundColor: darken(theme.palette.common.white, 0.7),
              },
            }}
          >
            <Unlink
              color={theme.palette.common.white}
              size={14}
              style={{ marginTop: "3px" }}
            />
          </StylesButton>
        </Grid>
      </MenuContainer>
    </BubbleMenu>
  ), [editor, theme]);

  return bubbleMenu;
};

export default EditorContextMenu;
