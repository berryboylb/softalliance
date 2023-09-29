import React from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./css/styles.module.css";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button className={Styles.button} onClick={handleGoBack}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
  );
};

export default BackButton;
