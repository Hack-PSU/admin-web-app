import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import FirebaseProvider from "./FirebaseProvider";
import QueryProvider from "./QueryProvider";

const firebaseConfig = {
  apiKey: String(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  databaseURL: String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL),
  projectId: String(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: String(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: String(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: String(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function DataClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryProvider>
        <FirebaseProvider auth={auth}>{children}</FirebaseProvider>
      </QueryProvider>
    </>
  );
}
