import { Suspense } from "react";
import Styles from "./css/style.module.css";
import { EmptyElement, Danger } from "../../assets";
export default function EleemntsEmpty() {
  return (
    <Suspense>
      <div className={Styles.empty}>
        <div className={Styles.inner}>
          <div className={Styles.img_con}>
            <img src={EmptyElement} alt="empty files" />
          </div>
          <p>
            {" "}
            <img src={Danger} alt="Danger Icon" />
            There are no elements to display
          </p>
        </div>
      </div>
    </Suspense>
  );
}
