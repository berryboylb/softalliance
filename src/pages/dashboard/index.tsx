import  { Suspense } from "react";
import Spinner from "../../components/Spinner/Spinner";
import LinkComp from "../../components/Link/Link";
const index = () => {
  return (
    <Suspense fallback={<Spinner toggle={false} />}>
      <LinkComp/>
    </Suspense>
  );
};

export default index;
