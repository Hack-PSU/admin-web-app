import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { useColumnBuilder } from "common/hooks";

const Hackers: NextPage = () => {
  const columns = useColumnBuilder((builder) =>
    builder
      .addColumn("Name")
      .addColumn("Pin")
      .addColumn("Email")
      .addColumn("University")
  );

  return <></>;
};

export default withDefaultLayout(Hackers);
