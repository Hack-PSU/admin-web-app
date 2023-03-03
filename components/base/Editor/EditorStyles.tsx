import { FC } from "react";
import { Editor } from "@tiptap/core";
import { ButtonGroup, darken, Grid, styled, useTheme } from "@mui/material";
import { EvaIcon } from "components/base";
import StylesButton from "components/base/Editor/StylesButton";

type Props = {
  editor: Editor;
};

const StylesContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1.2, 0),
}));

const EditorStyles: FC<Props> = ({ editor }) => {
  const theme = useTheme();

  return (
    <StylesContainer container item columnSpacing={2}>
      <Grid
        item
        sx={{
          borderRight: `2px solid ${darken(theme.palette.border.light, 0.03)}`,
          padding: theme.spacing(0, 2),
        }}
      >
        <ButtonGroup>
          <StylesButton
            disableElevation
            disableRipple
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </StylesButton>
          <StylesButton
            disableElevation
            disableRipple
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
            disableElevation
            disableRipple
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
      </Grid>
      <Grid item>
        <ButtonGroup>
          <StylesButton
            disableRipple
            disableElevation
            isActive={editor.isActive("link")}
          >
            <EvaIcon
              name={"link-2"}
              size={"medium"}
              style={{ marginTop: "3px", transform: "scale(0.95)" }}
              fill={theme.palette.common.black}
            />
          </StylesButton>
        </ButtonGroup>
      </Grid>
    </StylesContainer>
  );
};

export default EditorStyles;
