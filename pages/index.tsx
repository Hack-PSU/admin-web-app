import type { NextPage } from "next";
import {
  withProtectedRoute,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { AuthPermission } from "types/context";
import { Grid } from "@mui/material";
import { ControlledSelect, Input, Select } from "components/base";
import { FormProvider, useForm } from "react-hook-form";
import { DatePicker, TimePicker } from "components/base/Pickers";
import { useDateTime } from "common/hooks";
import { useColumnDef, useTable, Table } from "components/Table";
import { useQuery } from "react-query";
import { fetch, getAllLocations, QueryKeys } from "api";
import { useEffect, useMemo } from "react";

type LocationEntity = {
  name: string;
  uid: number;
};

const Home: NextPage = () => {
  const { data: allLocations } = useQuery(
    QueryKeys.location.findAll(),
    () => fetch(getAllLocations),
    {
      select: (data) => {
        if (data) {
          return data.map((d) => ({
            uid: d.uid,
            name: d.location_name,
          }));
        }
      },
    }
  );

  const defaultValues = useMemo(() => {
    if (allLocations) {
      return allLocations.reduce((acc, curr) => {
        acc[curr.uid] = curr;
        return acc;
      }, {} as { [key: number]: { name: string; uid: number } });
    }
  }, [allLocations]);

  const methods = useForm({
    defaultValues,
  });
  const { reset } = methods;

  useEffect(() => {
    reset({ ...defaultValues });
  }, [reset, defaultValues]);

  const defs = useColumnDef<LocationEntity>({
    columns: [
      {
        id: "name",
        type: "input",
        header: "Name",
        inputName: "name",
        placeholder: "Enter a location",
        accessorKey: "name",
      },
    ],
  });

  const table = useTable({
    data: allLocations ?? [],
    getRowId: (row) => String(row.uid),
    ...defs,
  });

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item sx={{ width: "100%" }}>
        <Table {...table}>
          <Table.GlobalActions>
            {/*<Table.GlobalRefresh onRefresh={() => {}} />*/}
            <Table.GlobalPageSize />
          </Table.GlobalActions>
          <Table.Container>
            <Table.Actions
              center={<Table.PaginationAction />}
              // right={<Table.DeleteAction onDelete={() => {}} />}
            />
            <Table.Header />
            <FormProvider {...methods}>
              <Table.Body />
            </FormProvider>
          </Table.Container>
        </Table>
      </Grid>
    </Grid>
  );
};

export const getServerSideProps = withServerSideProps();

export default withDefaultLayout(Home);
