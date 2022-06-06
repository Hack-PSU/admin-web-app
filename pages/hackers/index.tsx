import { NextPage } from "next";
import {
  resolveError,
  withDefaultLayout,
  withServerSideProps,
} from "common/HOCs";
import { useColumnBuilder } from "common/hooks";
import { getAllHackers } from "query";
import { IGetAllHackersResponse } from "types/api";
import { SimpleTable } from "components/Table";
import { useMemo } from "react";

interface IHackersPageProps {
  hackers: IGetAllHackersResponse[];
}

const Hackers: NextPage<IHackersPageProps> = ({ hackers }) => {
  const columns = useColumnBuilder((builder) =>
    builder
      .addColumn("Name", {
        maxWidth: 120,
      })
      .addColumn("Pin", {
        maxWidth: 80,
        minWidth: 50,
        width: 50,
      })
      .addColumn("Email", {
        minWidth: 150,
        maxWidth: 250,
      })
      .addColumn("University")
  );

  const hackersData = useMemo(
    () =>
      hackers
        ? hackers.map(({ firstname, lastname, pin, email, university }) => ({
            name: `${firstname} ${lastname}`,
            pin,
            email,
            university,
          }))
        : [],
    [hackers]
  );

  return <SimpleTable columns={columns} data={hackersData} />;
};

export const getServerSideProps = withServerSideProps(
  async (context, token) => {
    try {
      const resp = await getAllHackers(undefined, undefined, token);
      if (resp && resp.data) {
        return {
          props: {
            hackers: resp.data.body.data,
          },
        };
      }
    } catch (e: any) {
      resolveError(context, e);
    }
    return {
      props: {
        hackers: [],
      },
    };
  }
);

export default withDefaultLayout(Hackers);
