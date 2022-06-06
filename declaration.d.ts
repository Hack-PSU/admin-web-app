import "@mui/material/styles";
import { TypeBackground } from "@mui/material";

declare module "@mui/material/styles" {
  /* eslint-disable-next-line */ // Palette is an interface from @mui
  interface Palette {
    menu: {
      main: string;
      accent: string;
      line: string;
    };
    select: {
      main: string;
      placeholder: string;
    };
    input: {
      border: string;
    };
    button: {
      grey: string;
    };
    table: {
      header: string;
      divider: string;
    };
  }

  /* eslint-disable-next-line */ // PaletteOptions is an interface from @mui
  interface PaletteOptions {
    menu?: {
      main?: string;
      accent?: string;
      line?: string;
    };
    select?: {
      main?: string;
      placeholder?: string;
    };
    input?: {
      border?: string;
    };
    button?: {
      grey?: string;
    };
    table?: {
      header?: string;
      divider?: string;
    };
  }
}
