import { useState, lazy, useEffect, useMemo } from "react";
import ElementsLinkHeader from "../ElementsLinkHeader/ElementsLinkHeader";
import Modal from "../ModalMain/Modalmain";
import { Success, BigBin, RedCheck } from "../../assets";
import Styles from "./css/style.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { get, deleteOne } from "../../store/reducers/elementslink-reducer";
import Table from "../elementLinkTable/ElementLinkTable";
import { elementLinkAccessor } from "../../constants";
import SingleElementDetails from "../SingleElementPopup/SingleElementPopup";
import { ElementsLink } from "../../store/reducers/elementslink-reducer";
import Pagination from "../pagination/pagination";
const SuccessComp = lazy(() => import("../Success/Success"));
const DeleteComp = lazy(() => import("../Delete/Delete"));
const Empty = lazy(() => import("../EmptyElement/EmptyElement"));
const Form = lazy(
  () => import("../CreateElementsLinksForm/CreateElementsLinksForm")
);
const EditForm = lazy(() => import("../EditElementLink/EditElementLink"));
const ElementLinks = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { loading, elementsLink } = useAppSelector(
    (state) => state.elementsLink
  );
  //search
  const [selected, setSelected] = useState<ElementsLink>();
  const handleSelect = (val: ElementsLink | undefined) => setSelected(val);

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
      Math.ceil(elementsLink ? elementsLink?.length : 0 / postsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };
  const options = useMemo(() => {
    if (selected) return [{ ...selected }];

    return (
      elementsLink &&
      elementsLink.length > 0 &&
      elementsLink.slice(indexOfFirstPost, indexOfLastPost)
    );
  }, [elementsLink, selected, currentPage]);
  useEffect(() => {
    if (id) dispatch(get(id));
  }, [id, dispatch]);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [linkId, setLinkId] = useState<null | string>(null);
  const [secondModalIsOpen, secondSetIsOpen] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const togglePopup = () => setPopup((k) => !k);
  const toggleSecond = () => secondSetIsOpen((k) => !k);
  const toggle = () => setIsOpen((k) => !k);
  const handleLinkChange = (val: null | string) => {
    setLinkId(val);
  };
  const [edit, setEdit] = useState<boolean>(false);
  const toggleEdit = () => setEdit((k) => !k);
  const [editSuccess, setEditSuccess] = useState<boolean>(false);
  const toggleEditSuccess = () => setEditSuccess((k) => !k);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const toggleDeleteSuccess = () => setDeleteSuccess((k) => !k);

  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const toggleDeleteConfirm = () => setDeleteConfirm((k) => !k);
  return (
    <div>
      <h2 className={Styles.title}>Element Links</h2>
      <ElementsLinkHeader
        selected={selected}
        handleSelect={handleSelect}
        toggle={toggle}
      />
      {!loading && options && options.length > 0 ? (
        <>
          <Table
            columnsArr={elementLinkAccessor}
            dataArr={options}
            toggle={togglePopup}
            handleLinkChange={handleLinkChange}
            toggleDeleteConfirm={toggleDeleteConfirm}
            toggleEdit={toggleEdit}
          />
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={elementsLink?.length || 0}
            previousPage={previousPage}
            nextPage={nextPage}
            currentPage={currentPage}
            paginate={paginate}
          />
        </>
      ) : (
        <Empty text="There are no element links to display" />
      )}

      {popup && <SingleElementDetails linkId={linkId} toggle={togglePopup} />}
      <Modal modalIsOpen={modalIsOpen} closeModal={toggle}>
        <Form toggle={toggle} toggleSecond={toggleSecond} />
      </Modal>

      <Modal modalIsOpen={secondModalIsOpen} closeModal={toggleSecond}>
        <SuccessComp
          toggle={toggleSecond}
          message="Element Link has been created successfully"
          img={Success}
        />
      </Modal>

      <Modal modalIsOpen={edit} closeModal={toggleEdit}>
        <EditForm
          linkId={linkId}
          toggle={toggleEdit}
          toggleSecond={toggleEditSuccess}
        />
      </Modal>

      <Modal modalIsOpen={editSuccess} closeModal={toggleEditSuccess}>
        <SuccessComp
          toggle={toggleEditSuccess}
          message="Element link has been updated successfully"
          img={Success}
        />
      </Modal>

      <Modal modalIsOpen={deleteConfirm} closeModal={toggleDeleteConfirm}>
        <DeleteComp
          toggle={toggleDeleteConfirm}
          img={BigBin}
          message="Are you sure you want to delete Element Link?
"
          minitext="You can’t reverse this action"
          destroy={() => {
            if (linkId && id) {
              dispatch(deleteOne({ id, elementId: linkId }));
              toggleDeleteConfirm();
              toggleDeleteSuccess();
            }
          }}
          handleLinkChange={handleLinkChange}
        />
      </Modal>

      <Modal modalIsOpen={deleteSuccess} closeModal={toggleDeleteSuccess}>
        <SuccessComp
          toggle={toggleDeleteSuccess}
          img={RedCheck}
          message="Element Link has been deleted successfully"
        />
      </Modal>
    </div>
  );
};

export default ElementLinks;
