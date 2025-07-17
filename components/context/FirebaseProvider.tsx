"use client";

import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getIdToken,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  User,
} from "firebase/auth";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { FirebaseError } from "@firebase/util";
import nookies from "nookies";
import { initApi, resetApi } from "api/axios";
import { useRouter } from "next/router";
import { Auth } from "@firebase/auth/dist/node-esm";
import { WithChildren } from "common/types";
import posthog from 'posthog-js';

export interface IFirebaseProviderProps {
  auth: Auth;
}

export interface IJwtToken extends JwtPayload {
  production?: number;
  staging?: number;
}

export enum AuthPermission {
  NONE,
  VOLUNTEER = 1,
  TEAM,
  DIRECTOR,
}

export enum AuthError {
  NONE = "",
  INVALID_PASSWORD = "auth/wrong-password",
  INVALID_EMAIL = "auth/missing-email",
  NO_PERMISSION = "auth/no-permission",
}

export interface IFirebaseProviderHooks {
  user: User | undefined;
  token: string;
  permission: AuthPermission;
  isAuthenticated: boolean;
  error: AuthError;

  validatePermissions(privilege: number, userToken?: string): boolean;

  resolveAuthState(user?: User): Promise<void>;

  loginWithEmailAndPassword(email: string, password: string): Promise<void>;

  logout(): Promise<void>;
}

const FirebaseContext = createContext<IFirebaseProviderHooks>(
  {} as IFirebaseProviderHooks
);

const FirebaseProvider: FC<WithChildren<IFirebaseProviderProps>> = ({
  auth,
  children,
}) => {
  const router = useRouter();

  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState<string>("");
  const [permission, setPermission] = useState<AuthPermission>(
    AuthPermission.NONE
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<AuthError>(AuthError.NONE);

  // NEW FLAGS for session logic
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getUserIdToken = useCallback(async (usr: User) => {
    return await getIdToken(usr);
  }, []);

  const validatePermissions = useCallback(
    (privilege: number, userToken?: string) => {
      const validToken = userToken || token;
      if (!validToken) return false;

      const decoded = jwtDecode<IJwtToken>(validToken);
      if (decoded.iss?.includes("hackpsu-408118")) {
        if ((decoded.staging ?? 0) >= privilege) {
          setPermission(decoded.staging!);
          return true;
        }
        if ((decoded.production ?? 0) >= privilege) {
          setPermission(decoded.production!);
          return true;
        }
      }
      setError(AuthError.NONE);
      return false;
    },
    [token]
  );

  const validateToken = useCallback(
    async (usr: User) => {
      const idToken = await getUserIdToken(usr);
      setToken(idToken);
      nookies.set(undefined, "token", idToken, { path: "/" });
      return validatePermissions(AuthPermission.TEAM, idToken);
    },
    [getUserIdToken, validatePermissions]
  );

  const resolveAuthError = useCallback((code: string) => {
    switch (code) {
      case AuthError.INVALID_PASSWORD:
        setError(AuthError.INVALID_PASSWORD);
        break;
      case AuthError.INVALID_EMAIL:
        setError(AuthError.INVALID_EMAIL);
        break;
      default:
        setError(AuthError.NONE);
    }
  }, []);

  // **MERGED** resolveAuthState, now handles both:
  //  - "user" passed in from onAuthStateChanged
  //  - initial session check via /api/sessionUser
  const resolveAuthState = useCallback(
    async (usr?: User) => {
      if (isLoggingOut) return;
      let currentUser = usr;

      // if no firebase user given, try session endpoint
      if (!currentUser) {
        try {
          const res = await fetch(
            "https://auth.hackpsu.org/api/sessionUser",
            { method: "GET", credentials: "include" }
          );
          if (!res.ok) throw new Error(`Session check ${res.status}`);
          const data = await res.json();
          if (!data.customToken) throw new Error("No customToken");

          const cred = await signInWithCustomToken(auth, data.customToken);
          currentUser = cred.user;
          setToken(data.customToken);
          setError(AuthError.NONE);

          posthog.identify(cred.user.uid, {
            email: cred.user.email || undefined,
          });
        } catch {
          // no valid session → clear everything
          nookies.set(undefined, "token", "", { path: "/" });
          setUser(undefined);
          setToken("");
          setPermission(AuthPermission.NONE);
          setIsAuthenticated(false);
          setError(AuthError.NONE);
          return;
        }
      }

      // now if we have a firebase User, validate and set state
      if (currentUser) {
        if (await validateToken(currentUser)) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(undefined);
          setIsAuthenticated(false);
          setError(AuthError.NO_PERMISSION);
        }
      }
    },
    [auth, validateToken, isLoggingOut]
  );

  // initial session check on mount
  useEffect(() => {
    if (!hasInitialized && !isLoggingOut) {
      resolveAuthState(undefined).finally(() => setHasInitialized(true));
    }
  }, [hasInitialized, isLoggingOut, resolveAuthState]);

  // subscribe to firebase auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      resolveAuthState(usr ?? undefined);
    });
    return unsub;
  }, [auth, resolveAuthState]);

  // keep axios initialized on token change
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (usr) => {
      if (usr) {
        await initApi(usr);
      } else {
        resetApi();
      }
    });
    return unsub;
  }, [auth]);

  // email/password login stays the same
  const loginWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      setError(AuthError.NONE);
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (cred.user) {
          await resolveAuthState(cred.user);
          posthog.identify(cred.user.uid, {
            email: cred.user.email || undefined,
          });
        }
      } catch (e) {
        resolveAuthError((e as FirebaseError).code);
      }
    },
    [auth, resolveAuthError, resolveAuthState]
  );

  // LOGOUT now also calls sessionLogout
  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("https://auth.hackpsu.org/api/sessionLogout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("sessionLogout failed", e);
    }
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }

    posthog.reset();

    // clear all client state/cookie
    nookies.set(undefined, "token", "", { path: "/" });
    setUser(undefined);
    setToken("");
    setPermission(AuthPermission.NONE);
    setIsAuthenticated(false);
    setError(AuthError.NONE);

    await router.push("/login");
    setIsLoggingOut(false);
  }, [auth, isLoggingOut, router]);

  const value = useMemo(
    () => ({
      user,
      token,
      permission,
      isAuthenticated,
      error,
      validatePermissions,
      resolveAuthState,
      loginWithEmailAndPassword,
      logout,
    }),
    [
      user,
      token,
      permission,
      isAuthenticated,
      error,
      validatePermissions,
      resolveAuthState,
      loginWithEmailAndPassword,
      logout,
    ]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
export default FirebaseProvider;
