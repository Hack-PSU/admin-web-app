export function getEnvironment() {
  return {
    firebase: {
      apiKey: String(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      authDomain: String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
      databaseURL: String(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL),
      projectId: String(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
      storageBucket: String(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
      messagingSenderId: String(
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
      ),
      appId: String(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    },
    baseURL: String(process.env.NEXT_PUBLIC_BASE_URL),
  };
}
