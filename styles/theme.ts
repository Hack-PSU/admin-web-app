import {responsiveFontSizes, createTheme} from "@mui/material";

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      common: {
        black: "#1a1a1a",
        white: "#ffffff"
      }
    }
  })
)