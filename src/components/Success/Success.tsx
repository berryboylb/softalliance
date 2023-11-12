import React from "react";
import { Success } from "../../assets";
import Styles from "./css/style.module.css"
const SuccessComp = () => {
  return (
    <div className={Styles.con}>
      <img src={Success} alt={Success} />
      <h1>Element has been created successfully</h1>
      <button>Close to continue</button>
    </div>
  );
};

export default SuccessComp;
