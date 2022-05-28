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
      fontFamily: "Open Sans, Poppins",
      h1: {
        fontSize: '2.8rem',
        fontWeight: "bold",
      },
      h2: {
        fontSize: '2.4rem'
      },
    }
  })
);