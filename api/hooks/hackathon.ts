import { useQuery, useMutation, useQueryClient } from "react-query";
import { QueryKeys, HackathonEntity, getActiveHackathon, fetch } from "api";

export function useGetActiveHackathon() {
  return useQuery<Promise<HackathonEntity[] | undefined>>(
    QueryKeys.hackathon.findById(0),
    () => fetch(getActiveHackathon),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
}
