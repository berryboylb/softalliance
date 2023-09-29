import { Suspense, lazy, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { get } from "../../../store/reducers/elements-reducer";
import { getLoop } from "../../../store/reducers/lookup-reducer";
import { elementAccesor } from "../../../constants";
const EleemntsHeader = lazy(
  () => import("../../../components/ElementsHeader/ElementsHeader")
);
const Empty = lazy(
  () => import("../../../components/EmptyElement/EmptyElement")
);

const Table = lazy(() => import("../../../components/Table/Table"));
export default function Elements() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.elements);
  // const lookups = useAppSelector((state) => state.lookup);
  useEffect(() => {
    dispatch(get());
    dispatch(getLoop());
    console.log(elements, "elements");
  }, [dispatch]);
  return (
    <Suspense>
      <EleemntsHeader />
      {!elements.loading &&
      elements.elements &&
      elements.elements.length > 0 ? (
        <Table columnsArr={elementAccesor} dataArr={elements.elements} />
      ) : (
        <Empty />
      )}
    </Suspense>
  );
}
