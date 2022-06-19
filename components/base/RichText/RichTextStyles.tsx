import React, { FC, useEffect, useRef, useState } from "react";
import {
  darken,
  Grid,
  IconButton,
  lighten,
  Popover,
  styled,
  useTheme,
} from "@mui/material";
import { Button, EvaIcon, LabelledInput } from "components/base";

interface IRichTextStylesProps {
  onClickBold(): void;
  onClickItalic(): void;
  onClickUnderline(): void;
  onClickCreateLink(url: string): void;
  onClickOpenLinkPrompt(): { show: boolean; url: string };
  onRemoveLink(): void;
  urlData: string;
}

const EditorStyles = styled(Grid)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.border.light}`,
  padding: theme.spacing(1, 2),
}));

const EditorStyleButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(0.2),
  height: 25,
  width: 25,
  minWidth: 25,
  borderRadius: "5px",
  backgroundColor: "transparent",
  ":hover": {
    backgroundColor: lighten(theme.palette.common.black, 0.95),
  },
  userSelect: "none",
}));

const EditorStyleIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "transparent",
  width: 25,
  height: 25,
  minWidth: 25,
  borderRadius: "5px",
  padding: theme.spacing(0.2),
  ":hover": {
    backgroundColor: lighten(theme.palette.common.black, 0.95),
  },
}));

const RichTextStyles: FC<IRichTextStylesProps> = ({
  urlData,
  onClickOpenLinkPrompt,
  onClickBold,
  onClickUnderline,
  onClickItalic,
  onClickCreateLink,
  onRemoveLink,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [url, setUrl] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const shouldOpen = onClickOpenLinkPrompt();
    if (shouldOpen.show) {
      setUrl(shouldOpen.url);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUrl("");
  };

  const onClickConfirmLink = () => {
    onClickCreateLink(url);
    handleClose();
  };

  const onClickRemoveLink = () => {
    onRemoveLink();
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "create-link-popover" : undefined;

  return (
    <EditorStyles container item gap={2}>
      <Grid item>
        <EditorStyleButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClickBold}
        >
          B
        </EditorStyleButton>
      </Grid>
      <Grid item>
        <EditorStyleButton
          onMouseDown={(e) => e.preventDefault()}
          textProps={{
            sx: {
              fontStyle: "italic",
            },
          }}
          onClick={onClickItalic}
        >
          I
        </EditorStyleButton>
      </Grid>
      <Grid item>
        <EditorStyleButton
          onMouseDown={(e) => e.preventDefault()}
          textProps={{
            sx: {
              textDecoration: "underline",
              textUnderlineOffset: "1px",
            },
          }}
          onClick={onClickUnderline}
        >
          U
        </EditorStyleButton>
      </Grid>
      <Grid item>
        <EditorStyleIconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClick}
          aria-describedby={id}
        >
          <EvaIcon
            name={"link-2"}
            size="medium"
            style={{ transform: "scale(0.95)" }}
            fill={theme.palette.common.black}
          />
        </EditorStyleIconButton>
        <Popover
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
            alignItems="center"
            sx={{
              padding: theme.spacing(1, 2),
              width: "100%",
            }}
            flexDirection="column"
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
            <Grid container item justifyContent="center">
              <Grid item>
                <Button
                  onClick={onClickRemoveLink}
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
                <Button onClick={onClickConfirmLink}>Confirm</Button>
              </Grid>
            </Grid>
          </Grid>
        </Popover>
      </Grid>
    </EditorStyles>
  );
};

export default RichTextStyles;
