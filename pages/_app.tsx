import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DefaultLayout } from "components/layout";
import { ThemeProvider } from "@mui/material";
import { theme } from "styles";
import { QueryClientProvider, QueryClient } from "react-query";
import { FirebaseProvider } from "components/context";
import { getAuth } from "@firebase/auth";
import ApiProvider from "components/context/ApiProvider";
import { getEnvironment } from "common/config";
import { initializeApp } from "@firebase/app";

const client = new QueryClient();

const config = getEnvironment();
initializeApp(config.firebase);
const auth = getAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider auth={auth}>
        <QueryClientProvider client={client}>
          <ApiProvider baseURL={config.baseURL}>
            <DefaultLayout>
              <Component {...pageProps} />
            </DefaultLayout>
          </ApiProvider>
        </QueryClientProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default MyApp;
