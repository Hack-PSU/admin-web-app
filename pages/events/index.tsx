import { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { useColumnBuilder } from "common/hooks";
import { SimpleTable } from "components/Table";

const Events: NextPage = () => {
  const columns = useColumnBuilder((builder) =>
    builder.addColumn("Name").addColumn("Location").addColumn("Action")
  );

  return (
    <SimpleTable
      columns={columns}
      data={[{ name: "Tim", location: "Room", action: "Edit" }]}
    />
  );
};

export default withDefaultLayout(Events);
