import { useQuery, useMutation, useQueryClient } from "react-query";
import { QueryKeys, UserEntity, getAllUsers, fetch } from "api";

export function useGetHackersData(hackers?: UserEntity[]) {
  return useQuery(QueryKeys.hacker.findAll(), () => fetch(getAllUsers), {
    select: (data) => {
      if (data) {
        return data.map((d) => ({
          name: `${d.firstName} ${d.lastName}`,
          email: d.email,
          university: d.university,
        }));
      }
    },
    initialData: hackers,
  });
}
