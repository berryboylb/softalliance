
import Style from "../singleElementDetails/css/styles.module.css";
const SingleElementPopup = ({ toggle }: { toggle: () => void }) => {
  return (
    <div>
      <div>
        <button onClick={toggle}>cancel</button>

        <h1>Element Link Details</h1>

        <div className={Style.taby}>
          <div className={Style.left}>
            <label className={Style.label}>NAME</label>
            <p className={Style.para}>N/A</p>
          </div>

          <div className={Style.right}>
            <label className={Style.label}>sub organization</label>
            <p className={Style.para}>N/A</p>
          </div>
        </div>

        <div className={Style.taby}>
          <div className={Style.left}>
            <label className={Style.label}>Department</label>
            <p className={Style.para}>N/A</p>
          </div>

          <div className={Style.right}>
            <label className={Style.label}>Location</label>
            <p className={Style.para}>N/A</p>
          </div>
        </div>

        <div className={Style.taby}>
          <div className={Style.left}>
            <label className={Style.label}>Employee Type</label>
            <p className={Style.para}>N/A</p>
          </div>

          <div className={Style.right}>
            <label className={Style.label}>Employee Category</label>
            <p className={Style.para}>N/A</p>
          </div>
        </div>

        <div className={Style.taby}>
          <div className={Style.left}>
            <label className={Style.label}>Effective Date</label>
            <p className={Style.para}>N/A</p>
          </div>

          <div className={Style.right}>
            <label className={Style.label}>Status</label>
            <p className={Style.para}>N/A</p>
          </div>
        </div>

        <div className={Style.taby}>
          <div className={Style.left}>
            <label className={Style.label}>GRADE</label>
            <p className={Style.para}>N/A</p>
          </div>

          <div className={Style.right}>
            <label className={Style.label}>Grade Step</label>
            <p className={Style.para}>N/A</p>
          </div>
        </div>

        <div className={Style.taby}>
          <div className={Style.left}>
            <label className={Style.label}>Amount Type</label>
            <p className={Style.para}>N/A</p>
          </div>

          <div className={Style.right}>
            <label className={Style.label}>Amount</label>
            <p className={Style.para}>N/A</p>
          </div>
        </div>

        <div className={Style.taby}>
          <div className={Style.left}>
            <label className={Style.label}>PENSION</label>
            <p className={Style.para}>N/A</p>
          </div>

          <div className={Style.right}>
            <label className={Style.label}>Housing</label>
            <p className={Style.para}>N/A</p>
          </div>
        </div>

        <div className={Style.taby}>
          <div className={Style.left}>
            <label className={Style.label}>Effective Start Date</label>
            <p className={Style.para}>N/A</p>
          </div>

          <div className={Style.right}>
            <label className={Style.label}>Effective End Date</label>
            <p className={Style.para}>N/A</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleElementPopup;
