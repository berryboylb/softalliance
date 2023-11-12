import { Suspense, lazy, useEffect, useState, useMemo } from "react";
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
const Form = lazy(
  () => import("../../../components/CreateElementForm/CreateElementForm")
);
const SuccessComp = lazy(() => import("../../../components/Success/Success"));

export default function Elements() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.elements);
  const options = useMemo(() =>  elements.elements &&
      elements.elements.length > 0 && elements.elements, [elements.elements]);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [secondModalIsOpen, secondSetIsOpen] = useState<boolean>(false);
  const toggleSecond = () => secondSetIsOpen((k) => !k);
  const toggle = () => setIsOpen((k) => !k);
  // const lookups = useAppSelector((state) => state.lookup);
  useEffect(() => {
    dispatch(get());
    dispatch(getLoop());
  }, [dispatch]);
  return (
    <Suspense>
      <EleemntsHeader toggle={toggle} />
      {!elements.loading && options && options.length > 0 ? (
        <Table columnsArr={elementAccesor} dataArr={options} />
      ) : (
        <Empty />
      )}
      <Modal modalIsOpen={modalIsOpen} closeModal={toggle}>
        <Form toggle={toggle} toggleSecond={toggleSecond} />
      </Modal>

      <Modal modalIsOpen={secondModalIsOpen} closeModal={toggleSecond}>
        <SuccessComp />
      </Modal>
    </Suspense>
  );
}
