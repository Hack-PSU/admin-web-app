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
  }
}
