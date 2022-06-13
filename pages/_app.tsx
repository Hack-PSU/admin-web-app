import "react-datepicker/dist/react-datepicker.css";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "styles";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { FirebaseProvider } from "components/context";
import { auth } from "common/config";
import { AppPropsLayout } from "types/common";
import { Root } from "components/base";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider auth={auth}>
        <QueryClientProvider client={client}>
          <Root>
            {getLayout(<Component {...pageProps} />)}
            <ReactQueryDevtools initialIsOpen={false} />
          </Root>
        </QueryClientProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default MyApp;
