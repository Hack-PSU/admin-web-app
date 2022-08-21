import { useCallback, useEffect, useMemo } from "react";
import { NextPage } from "next";
import { withSettingsLayout } from "components/settings";
import { DefaultCell, Table, useColumnDef, useTable } from "components/Table";
import { useQuery } from "@tanstack/react-query";
import { fetch, QueryKeys, getAllOrganizers } from "api";
import { ControlledSelect } from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import { IOption } from "types/components";

type OrganizerEntity = {
  uid: string;
  name: string;
  permission?: string;
  email: string;
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
  const { data: allOrganizers, refetch } = useQuery(
    QueryKeys.organizer.findAll(),
    () => fetch(getAllOrganizers),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            uid: d.uid,
            name: `${d.firstname} ${d.lastname}`,
            email: d.email,
            permission: d.permission ?? "2",
          }));
        }
      },
    }
  );

  const defaultValues = useMemo(() => {
    if (allOrganizers) {
      return allOrganizers.reduce((acc, curr) => {
        acc[curr.uid] = curr;
        return acc;
      }, {} as { [key: string]: OrganizerEntity });
    }
    return {};
  }, [allOrganizers]);

  const methods = useForm({
    defaultValues,
  });

  const { reset } = methods;

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

  const data = useMemo(() => allOrganizers || [], [allOrganizers]);

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
    <>
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
          <Table.Content>
            <Table.Header />
            <FormProvider {...methods}>
              <Table.Body />
            </FormProvider>
          </Table.Content>
        </Table.Container>
      </Table>
    </>
  );
};

export default withSettingsLayout(SettingsMembers);
