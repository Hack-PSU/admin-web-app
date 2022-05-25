import {Auth, User} from "@firebase/auth";
import {JwtPayload} from "jwt-decode";
import {PaginatedQueryFn} from 'types/hooks'
import {GetAllEventsResponse, GetAllHackersResponse} from "types/api";

export interface IFirebaseProviderProps {
  auth: Auth
}

export interface JwtToken extends JwtPayload {
  privilege: number
}

export enum AuthPermission {
  NONE,
  VOLUNTEER = 1,
  TEAM,
  DIRECTOR
}

export enum AuthError {
  NONE = '',
  INVALID_PASSWORD = 'auth/wrong-password',
  INVALID_EMAIL = 'auth/missing-email',
  NO_PERMISSION = 'auth/no-permission',
}

export interface IFirebaseProviderHooks {
  user: User | undefined
  token: string
  permission: AuthPermission
  isAuthenticated: boolean
  error: AuthError
  validatePermissions(privilege: number, userToken?: string): boolean
  resolveAuthState(user?: User): Promise<void>
  loginWithEmailAndPassword(email: string, password: string): Promise<void>
  logout(): Promise<void>
}

export interface IApiProviderProps {
  baseURL: string
}

export interface IApiProviderHooks {
  getAllHackers: PaginatedQueryFn<GetAllHackersResponse[]>
  getAllEvents: PaginatedQueryFn<GetAllEventsResponse[]>
}
