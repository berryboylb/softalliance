import { useState, lazy } from "react";
import ElementsLinkHeader from "../ElementsLinkHeader/ElementsLinkHeader";
import Modal from "../ModalMain/Modalmain";
import { Success } from "../../assets";
import Styles from "./css/style.module.css";
const SuccessComp = lazy(() => import("../Success/Success"));
const ElementLinks = () => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [secondModalIsOpen, secondSetIsOpen] = useState<boolean>(true);
  const toggleSecond = () => secondSetIsOpen((k) => !k);
  const toggle = () => setIsOpen((k) => !k);
  return (
    <div>
      <h2 className={Styles.title}>Element Links</h2>
      <ElementsLinkHeader toggle={toggle} />
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
