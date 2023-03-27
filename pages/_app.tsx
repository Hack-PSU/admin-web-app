import "react-datepicker/dist/react-datepicker.css";
import "draft-js/dist/Draft.css";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FirebaseProvider } from "components/context";
import { auth } from "common/config";
import { Root } from "components/base";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import { ErrorSnackbar, SuccessSnackbar } from "components/snackbar";
import { AppPropsLayout } from "common/types";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>HackPSU Admin</title>
      </Head>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          Components={{
            success: SuccessSnackbar,
            error: ErrorSnackbar,
          }}
        >
          <FirebaseProvider auth={auth}>
            <QueryClientProvider client={client}>
              <Root>
                {getLayout(<Component {...pageProps} />)}
                <ReactQueryDevtools initialIsOpen={false} />
              </Root>
            </QueryClientProvider>
          </FirebaseProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
