import { Suspense, lazy, useEffect, useState } from "react";
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
const Modal = lazy(() => import("../../../components/ModalMain/Modalmain"));
const Form = lazy(() => import("../../../components/CreateElementForm/CreateElementForm"));

export default function Elements() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.elements);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => setIsOpen((k) => !k);
  // const lookups = useAppSelector((state) => state.lookup);
  useEffect(() => {
    dispatch(get());
    dispatch(getLoop());
    console.log(elements, "elements");
  }, [dispatch]);
  return (
    <Suspense>
      <EleemntsHeader toggle={toggle} />
      {!elements.loading &&
      elements.elements &&
      elements.elements.length > 0 ? (
        <Table columnsArr={elementAccesor} dataArr={elements.elements} />
      ) : (
        <Empty />
      )}
      <Modal modalIsOpen={modalIsOpen} closeModal={toggle}>
       <Form/>
      </Modal>
    </Suspense>
  );
}
