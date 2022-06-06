import "react-datepicker/dist/react-datepicker.css";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { theme } from "styles";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { FirebaseProvider } from "components/context";
import { getAuth } from "@firebase/auth";
import { getEnvironment } from "common/config";
import { initializeApp } from "@firebase/app";
import { AppPropsLayout } from "types/common";

const client = new QueryClient();
const config = getEnvironment();

const app = initializeApp(config.firebase);
const auth = getAuth(app);

function MyApp({ Component, pageProps }: AppPropsLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ThemeProvider theme={theme}>
      <FirebaseProvider auth={auth}>
        <QueryClientProvider client={client}>
          {getLayout(<Component {...pageProps} />)}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </FirebaseProvider>
    </ThemeProvider>
  );
}

export default MyApp;
