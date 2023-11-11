import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import React, { Suspense } from "react";
import Spinner from "../Spinner/Spinner";
import Styles from "./css/styles.module.css"
type ModalProp = {
  onclick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children: React.ReactNode;
};
const BackDrop: React.FC<ModalProp> = ({ onclick, children }) => {
  return (
    <Suspense fallback={<Spinner toggle={false} />}>
      <div className={Styles.backdrop}>
        <button onClick={onclick} className={Styles.btn}>
          <FontAwesomeIcon className={Styles.icon} icon={faTimesCircle} />
        </button>
        {children}
      </div>
    </Suspense>
  );
};

export default BackDrop