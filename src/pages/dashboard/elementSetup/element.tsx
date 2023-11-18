import { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { get, deleteOne } from "../../../store/reducers/elements-reducer";
import { getLoop } from "../../../store/reducers/lookup-reducer";
import { elementAccesor } from "../../../constants";
import { BigBin, RedCheck, Success } from "../../../assets";
import { Elements as ElementsType } from "../../../store/reducers/elements-reducer";
import Pagination from "../../../components/pagination/pagination";
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

const EditForm = lazy(
  () => import("../../../components/EditElementsForm/EditElementForm")
);

export default function Elements() {
  const dispatch = useAppDispatch();
  const elements = useAppSelector((state) => state.elements);
  //search
  const [selected, setSelected] = useState<ElementsType>();
  const handleSelect = (val: ElementsType | undefined) => setSelected(val);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(3);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (
      currentPage !==
      Math.ceil(
        elements.elements ? elements.elements?.length : 0 / postsPerPage
      )
    ) {
      setCurrentPage(currentPage + 1);
    }
  };
  const options = useMemo(() => {
    if (selected) {
      console.log(selected);
      return [{ ...selected }];
    }

    return (
      elements.elements &&
      elements.elements.length > 0 &&
      elements.elements.slice(indexOfFirstPost, indexOfLastPost)
      // Array.from({ length: totalItems }, (_, index) => index + 1).slice(
      //   (currentPage - 1) * itemsPerPage,
      //   currentPage * itemsPerPage
      // )
    );
  }, [elements.elements, selected, currentPage]);
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
      <EleemntsHeader
        selected={selected}
        handleSelect={handleSelect}
        toggle={toggle}
      />
      {!elements.loading && options && options.length > 0 ? (
        <>
          <Table
            columnsArr={elementAccesor}
            dataArr={options}
            toggle={toggleDelete}
            handleLinkChange={handleLinkChange}
            box={box}
            toggleBox={toggleBox}
            toggleEdit={toggleEdit}
          />
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={elements.elements?.length || 0}
            previousPage={previousPage}
            nextPage={nextPage}
            currentPage={currentPage}
            paginate={paginate}
          />
        </>
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
