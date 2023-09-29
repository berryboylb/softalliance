import  { Suspense } from "react";
import Spinner from "../../components/Spinner/Spinner";
const index = () => {
  return (
    <Suspense fallback={<Spinner toggle={false} />}>
      hello
    </Suspense>
  );
};

export default index;
