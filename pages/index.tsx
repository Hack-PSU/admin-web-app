import type { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Editor } from "components/base/Editor";

type LocationEntity = {
  name: string;
  uid: number;
};

const Home: NextPage = () => {
  return (
    <Editor
      value={""}
      onChange={(value) => console.log(value)}
      placeholder={"Type in a word"}
    />
  );
};

// export const getServerSideProps = withServerSideProps(() => {
//   return {
//     redirect: {
//       destination: "/hackers",
//       permanent: false,
//     },
//   };
// });

export default withDefaultLayout(Home);
