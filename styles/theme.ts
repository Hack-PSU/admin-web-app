import {responsiveFontSizes, createTheme} from "@mui/material";

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      common: {
        black: "#1a1a1a",
        white: "#ffffff"
      }
    },
    typography: {
      htmlFontSize: 16,
      h1: {
        fontSize: '2.8rem',
      },
      h2: {
        fontSize: '2.4rem'
      }
    }
  })
);