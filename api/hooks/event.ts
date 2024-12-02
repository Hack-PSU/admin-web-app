import { useQuery, useMutation, useQueryClient } from "react-query";
import { QueryKeys, getAllEvents, fetch, deleteEvent } from "api";
import _ from "lodash";

export function useGetEventsData() {
  return useQuery(QueryKeys.event.findAll(), () => fetch(getAllEvents), {
    select: (data) => {
      if (data) {
        return (
          _.chain(data)
            .map((d) => {
              return {
                id: d.id,
                name: d.name,
                location: d.location?.name ?? "",
                startTime: d.startTime,
                endTime: d.endTime,
                type: d.type,
              };
            })
            .value()
            // Underlying sort by start time and location name is generally useful, even when sorting by other fields.
            .sort((event1, event2) => {
              if (event1.startTime != event2.startTime) {
                return event1.startTime - event2.startTime;
              }
              return event1.location > event2.location ? 1 : -1;
            })
        );
      }
      return [];
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id }: { id: string }) => fetch(() => deleteEvent({}, { id })),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.event.all);
      },
    }
  );
}
