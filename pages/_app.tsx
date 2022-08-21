import "react-datepicker/dist/react-datepicker.css";
import "draft-js/dist/Draft.css";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "styles";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FirebaseProvider } from "components/context";
import { auth } from "common/config";
import { AppPropsLayout } from "types/common";
import { Root } from "components/base";
import Head from "next/head";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>HackPSU Admin</title>
      </Head>
      <ThemeProvider theme={theme}>
        <FirebaseProvider auth={auth}>
          <QueryClientProvider client={client} contextSharing>
            <Root>
              {getLayout(<Component {...pageProps} />)}
              <ReactQueryDevtools initialIsOpen={false} />
            </Root>
          </QueryClientProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
