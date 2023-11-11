import { lazy, ReactNode } from "react";
const Modal = lazy(() => import("../Modal/Modal"));
const Backdrop = lazy(() => import("../Backdrop/Backdrop"));

const Modalain = ({
  modalIsOpen,
  closeModal,
  children,
}: {
  modalIsOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
}) => {
  return (
    <Modal visible={modalIsOpen}>
      <Backdrop onclick={closeModal}>{children}</Backdrop>
    </Modal>
  );
};

export default Modalain;
