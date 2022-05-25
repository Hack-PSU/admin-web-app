import React, {useCallback, createContext, FC, useContext, useEffect, useMemo, useRef} from "react";
import {WithChildren} from "types/common";
import { PaginatedQueryFn } from 'types/hooks'
import axios, {AxiosInstance} from "axios";
import {useFirebase} from "./FirebaseProvider";
import {IApiProviderHooks, IApiProviderProps} from "types/context";
import {useEventCallback} from "@mui/material";
import {GetAllEventsResponse, GetAllHackersResponse} from "types/api";

const ApiContext = createContext<IApiProviderHooks>({} as IApiProviderHooks)

const ApiProvider: FC<WithChildren<IApiProviderProps>> = ({baseURL, children}) => {
  const api = useRef<AxiosInstance>()
  const {token} = useFirebase()

  useEffect(() => {
    if (token) {
      api.current = axios.create({
        baseURL: baseURL,
        headers: {
          idtoken: token
        }
      })
    }
  }, [baseURL, token])

  const getAllHackers: PaginatedQueryFn<GetAllHackersResponse[]> = useCallback(async (offset, limit) => {
    if (api.current) {
      return (await api.current?.get<GetAllHackersResponse[]>("/admin/data", {
        params: {
          type: "registration",
          offset: offset ?? 0,
          ...(limit ? { limit } : {})
        }
      })).data
    }
  }, [])
  
  const getAllEvents: PaginatedQueryFn<GetAllEventsResponse[]> = useCallback(async (offset, limit) => {
    if (api.current) {
      return (await api.current?.get<GetAllEventsResponse[]>("/live/events", {
        params: {
          offset: offset ?? 0,
          ...(limit ? { limit } : {})
        }
      })).data
    }
  }, [])

  const value = useMemo(() => ({
    getAllHackers,
    getAllEvents,
  }), [
    getAllHackers,
    getAllEvents,
  ])

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}

export const useApi = () => useContext(ApiContext)
export default ApiProvider
