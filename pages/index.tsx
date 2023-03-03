import type { NextPage } from "next";
import { withDefaultLayout } from "common/HOCs";
import { Editor } from "components/base/Editor";

type LocationEntity = {
  name: string;
  uid: number;
};

const Home: NextPage = () => {
  return <Editor />;
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
