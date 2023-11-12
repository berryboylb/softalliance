import Styles from "./css/style.module.css"
const SuccessComp = ({
  message,
  img,
  toggle,
}: {
  message: string;
  img: string;
  toggle: () => void;
}) => {
  return (
    <div className={Styles.con}>
      <img src={img} alt={img} />
      <h1>{message}</h1>
      <button onClick={toggle}>Close to continue</button>
    </div>
  );
};

export default SuccessComp;
