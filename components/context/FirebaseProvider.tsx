import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { WithChildren } from "types/common";
import {
  getIdToken,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "@firebase/auth";
import {
  AuthError,
  AuthPermission,
  IFirebaseProviderHooks,
  IFirebaseProviderProps,
  IJwtToken,
} from "types/context";
import jwtDecode from "jwt-decode";
import { FirebaseError } from "@firebase/util";
import nookies from "nookies";

const FirebaseContext = createContext<IFirebaseProviderHooks>(
  {} as IFirebaseProviderHooks
);

const FirebaseProvider: FC<WithChildren<IFirebaseProviderProps>> = ({
  auth,
  children,
}) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState<string>("");
  const [permission, setPermission] = useState<AuthPermission>(
    AuthPermission.NONE
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<AuthError>(AuthError.NONE);

  const getUserIdToken = useCallback(async (user: User) => {
    return await getIdToken(user);
  }, []);

  const validatePermissions = useCallback(
    (privilege: number, userToken?: string) => {
      const validToken = userToken || token || "";
      if (validToken) {
        const decoded = jwtDecode<IJwtToken>(validToken);
        if (decoded.iss && decoded.iss.includes("hackpsu18")) {
          setPermission(decoded.privilege);
          if (decoded.privilege && decoded.privilege >= privilege) {
            return true;
          }
        }
      }
      setError(AuthError.NONE);
      return false;
    },
    [token]
  );

  const validateToken = useCallback(
    async (user: User) => {
      const token = await getUserIdToken(user);
      setToken(token);
      nookies.set(undefined, "idtoken", token, { path: "/" });

      return validatePermissions(AuthPermission.TEAM, token);
    },
    [getUserIdToken, validatePermissions]
  );

  const resolveAuthState = useCallback(
    async (user?: User) => {
      if (user) {
        if (await validateToken(user)) {
          setUser(user);
          setIsAuthenticated(true);
        } else {
          setUser(undefined);
          setIsAuthenticated(false);
          setError(AuthError.NO_PERMISSION);
        }
      } else {
        nookies.set(undefined, "idtoken", "", { path: "/" });
        setUser(undefined);
        setIsAuthenticated(false);
        setError(AuthError.NONE);
      }
    },
    [validateToken]
  );

  const resolveAuthError = useCallback((error: string) => {
    switch (error) {
      case "auth/wrong-password":
        setError(AuthError.INVALID_PASSWORD);
        break;
      case "auth/missing-email":
        setError(AuthError.INVALID_EMAIL);
        break;
    }
  }, []);

  const loginWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      setError(AuthError.NONE);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (userCredential.user) {
          await resolveAuthState(userCredential.user);
        }
      } catch (e) {
        resolveAuthError((e as FirebaseError).code);
      }
    },
    [auth, resolveAuthError, resolveAuthState]
  );

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  }, [auth]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      await resolveAuthState(user ?? undefined);
    });
  }, [auth, resolveAuthState]);

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
