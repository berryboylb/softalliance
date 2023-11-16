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
const SuccessComp = lazy(() => import("../Success/Success"));
const DeleteComp = lazy(() => import("../Delete/Delete"));
const Empty = lazy(() => import("../EmptyElement/EmptyElement"));
const Form = lazy(() => import("../CreateElementsLinksForm/CreateElementsLinksForm"));
const EditForm = lazy(() => import("../EditElementLink/EditElementLink"));
const ElementLinks = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { loading, elementsLink } = useAppSelector(
    (state) => state.elementsLink
  );
  const options = useMemo(
    () => elementsLink && elementsLink.length > 0 && elementsLink,
    [elementsLink]
  );
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
      <ElementsLinkHeader toggle={toggle} />
      {!loading && options && options.length > 0 ? (
        <Table
          columnsArr={elementLinkAccessor}
          dataArr={options}
          toggle={togglePopup}
          handleLinkChange={handleLinkChange}
          toggleDeleteConfirm={toggleDeleteConfirm}
          toggleEdit={toggleEdit}
        />
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
          toggle={toggleSecond}
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
