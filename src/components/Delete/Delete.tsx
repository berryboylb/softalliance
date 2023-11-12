import Styles from "./css/styles.module.css";
const DeleteComp = ({
  message,
  minitext,
  img,
  toggle,
  destroy,
  handleLinkChange,
}: {
  message: string;
  img: string;
  toggle: () => void;
  minitext: string;
  destroy: () => void;
  handleLinkChange: (val: string | null) => void;
}) => {
    return (
      <div className={Styles.bacdrop}>
        <div className={Styles.con}>
          <img src={img} alt={img} />
          <h1>{message}</h1>
          <p>{minitext}</p>
          <div className={Styles.div__}>
            <button
              className={Styles.close__}
              onClick={() => {
                toggle();
                handleLinkChange(null);
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className={Styles.forward__}
              onClick={destroy}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    );
};

export default DeleteComp;
