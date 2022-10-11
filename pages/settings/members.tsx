import { useCallback, useEffect, useMemo } from "react";
import { NextPage } from "next";
import { withSettingsLayout } from "components/settings";
import { DefaultCell, Table, useColumnDef, useTable } from "components/Table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetch,
  QueryKeys,
  getAllOrganizers,
  MutateEntity,
  IOrganizerEntity,
  updateOrganizer,
  updateOrganizerPermissions,
  CreateEntity,
} from "api";
import { ControlledSelect } from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import { IOption } from "types/components";
import { useSnackbar } from "notistack";
import _ from "lodash";
import { useFirebase } from "components/context";

type OrganizerEntity = {
  uid: string;
  name: string;
  permission: IOption;
  email: string;
};

type UpdateOrganizerEntity = {
  uid: string;
  privilege: number;
};

const PermissionOptions: IOption[] = [
  {
    value: "1",
    label: "Volunteer",
  },
  {
    value: "2",
    label: "Team Member",
  },
  {
    value: "3",
    label: "Exec Member",
  },
  {
    value: "4",
    label: "Tech-Exec",
  },
  {
    value: "5",
    label: "Finance Director",
  },
];

const SettingsMembers: NextPage = () => {
  const { user } = useFirebase();

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: allOrganizers, refetch } = useQuery(
    QueryKeys.organizer.findAll(),
    () => fetch(getAllOrganizers),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => {
            const permission = PermissionOptions.find(
              (p) => p.value === String(d.privilege)
            );
            return {
              uid: d.uid,
              name: `${d.firstname} ${d.lastname}`,
              email: d.email,
              permission: permission ?? { value: "2", label: "Team Member" },
            };
          });
        }
      },
    }
  );

  const { mutateAsync } = useMutation(
    QueryKeys.organizer.updateOne(),
    ({ entity }: CreateEntity<UpdateOrganizerEntity, "">) =>
      fetch(() => updateOrganizerPermissions(entity)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(QueryKeys.organizer.all);
        enqueueSnackbar("Successfully updated organizer", {
          variant: "success",
        });
      },
      onError: () => {
        enqueueSnackbar("Error occurred updating organizer", {
          variant: "error",
        });
      },
    }
  );

  const data = useMemo(() => {
    if (user && allOrganizers) {
      return _.filter(allOrganizers, (o) => o.uid !== user.uid);
    }
    return [];
  }, [allOrganizers, user]);

  const defaultValues = useMemo(() => {
    if (data) {
      return data.reduce((acc, curr) => {
        const permission = PermissionOptions.find(
          (p) => p.value === curr.permission.value
        );

        acc[curr.uid] = {
          ...curr,
          permission: { value: "2", label: "Team Member" },
        };

        if (permission) {
          acc[curr.uid].permission = permission;
        }

        return acc;
      }, {} as { [key: string]: OrganizerEntity });
    }
    return {};
  }, [data]);

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch } = methods;

  const submitOrganizerUpdate = useCallback(
    async (entities: UpdateOrganizerEntity[]) => {
      await Promise.all(_.map(entities, (entity) => mutateAsync({ entity })));
    },
    [mutateAsync]
  );

  useEffect(() => {
    const subscription = watch((data, info) => {
      if (info.type === "change") {
        const entities: UpdateOrganizerEntity[] = _.chain(data)
          .pickBy((value, uid) => {
            if (value && value.permission) {
              return (
                defaultValues[uid].permission?.value !== value.permission?.value
              );
            }
            return false;
          })
          .map((value, uid) => ({
            uid: uid,
            privilege: parseInt(value?.permission?.value ?? "2"),
          }))
          .value();

        if (entities) {
          void submitOrganizerUpdate(entities);
        }
      }
    });

    return subscription.unsubscribe;
  }, [defaultValues, submitOrganizerUpdate, watch]);

  useEffect(() => {
    reset({ ...defaultValues });
  }, [reset, defaultValues]);

  const defs = useColumnDef<OrganizerEntity>({
    columns: [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        type: "text",
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        type: "text",
      },
      {
        id: "permission",
        header: "",
        type: "custom",
        accessorKey: "permission",
        enableSorting: false,
        cell: ({ row, column }) => (
          <DefaultCell column={column}>
            <ControlledSelect
              name={`${row.original.uid}.permission`}
              key={row.original.uid}
              options={PermissionOptions}
            />
          </DefaultCell>
        ),
      },
    ],
  });

  const table = useTable({
    ...defs,
    getRowId: (row) => row.uid,
    data,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const onDelete = useCallback(() => {
    return null;
  }, []);

  return (
    <Table {...table}>
      <Table.GlobalActions>
        <Table.GlobalRefresh onRefresh={onRefresh} />
        <Table.GlobalPageSize />
      </Table.GlobalActions>
      <Table.Container>
        <Table.Actions
          center={<Table.PaginationAction />}
          right={<Table.DeleteAction onDelete={onDelete} />}
        />
        <Table.Content overflowVisible>
          <Table.Header />
          <FormProvider {...methods}>
            <Table.Body />
          </FormProvider>
        </Table.Content>
      </Table.Container>
    </Table>
  );
};

export default withSettingsLayout(SettingsMembers);
