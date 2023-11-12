import { useState, lazy, useEffect, useMemo } from "react";
import ElementsLinkHeader from "../ElementsLinkHeader/ElementsLinkHeader";
import Modal from "../ModalMain/Modalmain";
import { Success } from "../../assets";
import Styles from "./css/style.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { get } from "../../store/reducers/elementslink-reducer";
import Table from "../elementLinkTable/ElementLinkTable";
import { elementLinkAccessor } from "../../constants";
import SingleElementDetails from "../SingleElementPopup/SingleElementPopup";
const SuccessComp = lazy(() => import("../Success/Success"));
const Empty = lazy(() => import("../EmptyElement/EmptyElement"));
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
        />
      ) : (
        <Empty text="There are no element links to display" />
      )}
      {popup && <SingleElementDetails linkId={linkId} toggle={togglePopup} />}
      <Modal modalIsOpen={modalIsOpen} closeModal={toggle}>
        HELLO FORM
      </Modal>

      <Modal modalIsOpen={secondModalIsOpen} closeModal={toggleSecond}>
        <SuccessComp
          toggle={toggleSecond}
          message="Element Link has been created successfully"
          img={Success}
        />
      </Modal>
    </div>
  );
};

export default ElementLinks;
