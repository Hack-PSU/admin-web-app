import { responsiveFontSizes, createTheme } from "@mui/material";
import { Shadows } from "@mui/material/styles/shadows";

export const theme = responsiveFontSizes(
  createTheme({
    shadows: [
      "none",
      "0px 3px 15px rgba(0, 0, 0, 0.18)",
      "0px 5px 6px rgba(0, 0, 0, 0.25)",
      "0px 8px 10px rgba(0, 0, 0, 0.25)",
      "0px 8px 8px rgba(0, 0, 0, 0.25)",
      ...Array(20).fill("none"),
    ] as Shadows,
    palette: {
      common: {
        black: "#1a1a1a",
        white: "#ffffff",
      },
      button: {
        grey: "#f0f0f0",
      },
      menu: {
        main: "#f5f5f5",
        line: "#d6d6d6",
        accent: "#2878DA",
      },
      table: {
        header: "#969696",
        divider: "#bdbdbd",
      },
      select: {
        main: "#1a1a1a",
        placeholder: "#bebebe",
      },
      success: {
        main: "#50c96c",
      },
      error: {
        main: "#f25959",
      },
      input: {
        border: "#d5d8dc",
      },
    },
    typography: {
      htmlFontSize: 16,
      fontFamily:
        "Inter, Poppins, -apple-system, 'Helvetica Neue', Arial, sans-serif",
      h1: {
        fontWeight: "bold",
        fontFamily: "Poppins",
      },
      h2: {
        fontFamily: "Poppins",
      },
      h3: {
        fontFamily: "Poppins",
      },
      h4: {
        fontFamily: "Inter",
      },
      body1: {
        fontSize: "0.9rem",
        fontFamily: "Inter",
      },
      body2: {
        fontFamily: "Inter",
      },
      button: {
        fontFamily: "Inter",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "15px",
          },
        },
        defaultProps: {
          sx: {
            color: "common.black",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              WebkitTextFillColor: "#1a1a1a",
            },
          },
        },
        defaultProps: {
          style: {
            fontFamily: "Poppins",
            fontWeight: "normal",
            fontSize: "1rem",
          },
        },
      },
      MuiMenu: {
        defaultProps: {
          style: {
            fontFamily: "Poppins",
            fontWeight: "normal",
            fontSize: "0.8rem",
          },
          PaperProps: {
            style: {
              fontSize: "0.8rem",
            },
          },
        },
      },
    },
  })
);
