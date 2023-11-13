import { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { get, deleteOne } from "../../../store/reducers/elements-reducer";
import { getLoop } from "../../../store/reducers/lookup-reducer";
import { elementAccesor } from "../../../constants";
import { BigBin, RedCheck, Success } from "../../../assets";
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

const DeleteComp = lazy(() => import("../../../components/Delete/Delete"));

const EditForm = lazy(() => import("../../../components/EditElementsForm/EditElementForm"));

export default function Elements() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.elements);
  const options = useMemo(
    () =>
      elements.elements && elements.elements.length > 0 && elements.elements,
    [elements.elements]
  );
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [secondModalIsOpen, secondSetIsOpen] = useState<boolean>(false);
  const toggleSecond = () => secondSetIsOpen((k) => !k);
  const toggle = () => setIsOpen((k) => !k);

  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const toggleDelete = () => setModalDelete((k) => !k);

  //delete successfull
  const [modalSuccesfulDelete, setSuccesfulModalDelete] =
    useState<boolean>(false);
  const toggleSuccesfulDelete = () => setSuccesfulModalDelete((k) => !k);

  //edit succesful
  const [modalSuccesfulEdit, setModalSuccesfulEdit] = useState<boolean>(false);
  const toggleSuccesfulEdit = () => setModalSuccesfulEdit((k) => !k);

  //edit form
  const [modalEdit, setModaldit] = useState<boolean>(false);
  const toggleEdit = () => setModaldit((k) => !k);

  const [linkId, setLinkId] = useState<null | string>(null);

  const handleLinkChange = (val: null | string) => {
    setLinkId(val);
  };

  const [box, setBox] = useState(false);
  const toggleBox = () => setBox((K) => !K);
  useEffect(() => {
    dispatch(get());
    dispatch(getLoop());
  }, [dispatch]);
  return (
    <Suspense>
      <EleemntsHeader toggle={toggle} />
      {!elements.loading && options && options.length > 0 ? (
        <Table
          columnsArr={elementAccesor}
          dataArr={options}
          toggle={toggleDelete}
          handleLinkChange={handleLinkChange}
          box={box}
          toggleBox={toggleBox}
          toggleEdit={toggleEdit}
        />
      ) : (
        <Empty text="There are no elements to display" />
      )}
      <Modal modalIsOpen={modalIsOpen} closeModal={toggle}>
        <Form toggle={toggle} toggleSecond={toggleSecond} />
      </Modal>

      <Modal modalIsOpen={secondModalIsOpen} closeModal={toggleSecond}>
        <SuccessComp
          toggle={toggleSecond}
          img={Success}
          message="Element has been created successfully"
        />
      </Modal>

      {/* {linkId && linkId} */}
      {modalDelete && (
        <DeleteComp
          toggle={() => {
            toggleDelete();
            toggleBox();
          }}
          img={BigBin}
          message="Are you sure you want to delete Element?"
          minitext="You can’t reverse this action"
          destroy={() => {
            if (linkId) {
              dispatch(deleteOne(linkId));
              toggleDelete();
              toggleSuccesfulDelete();
            }
          }}
          handleLinkChange={handleLinkChange}
        />
      )}

      {/* delete successful */}
      <Modal
        modalIsOpen={modalSuccesfulDelete}
        closeModal={toggleSuccesfulDelete}
      >
        <SuccessComp
          toggle={toggleSuccesfulDelete}
          img={RedCheck}
          message="Element has been deleted successfully"
        />
      </Modal>

      {/* edit successful */}
      <Modal modalIsOpen={modalSuccesfulEdit} closeModal={toggleSuccesfulEdit}>
        <SuccessComp
          toggle={toggleSuccesfulEdit}
          img={Success}
          message="Element has been updated successfully"
        />
      </Modal>

      {/* edit  */}
      <Modal modalIsOpen={modalEdit} closeModal={toggleEdit}>
        <EditForm
          linkId={linkId}
          toggle={toggleEdit}
          toggleSecond={toggleSuccesfulEdit}
        />
      </Modal>
    </Suspense>
  );
}
