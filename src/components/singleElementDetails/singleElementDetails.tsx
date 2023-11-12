import React from "react";
import Style from "./css/styles.module.css";
import { useAppSelector } from "../../store/hooks";
import { LookupValues } from "../../store/reducers/category";
import { convertDateFormatOnly } from "../../utils";
import useDataFetching from "../CreateElementForm/useFetchLookups";
const getName = (id: string, arr: Array<LookupValues>): string => {
  if (!arr || arr.length < 0) return "N/A";
  const item = arr.find((item) => item.id === id);
  if (!item) return "N/A";
  return item.name;
};
const SingleElementDetails = () => {
  useDataFetching();
  const { singleElement } = useAppSelector((state) => state.elements);
  const { category } = useAppSelector((state) => state.category);
  const { classification } = useAppSelector((state) => state.classification);
  const { payrun } = useAppSelector((state) => state.payrun);
  return (
    <div>
      <div className={Style.taby}>
        <div className={Style.left}>
          <label className={Style.label}>Element Name</label>
          <p className={Style.para}>{singleElement?.name}</p>
        </div>

        <div className={Style.right}>
          <label className={Style.label}>Element Classification</label>
          <p className={Style.para}>
            {getName(
              singleElement?.classificationValueId
                ? String(singleElement?.classificationValueId)
                : "",
              classification ? classification : []
            )}
          </p>
        </div>
      </div>
      <div className={Style.taby}>
        <div className={Style.left}>
          <label className={Style.label}>ELEMENT category</label>
          <p className={Style.para}>
            {" "}
            {getName(
              singleElement?.categoryValueId
                ? String(singleElement?.categoryValueId)
                : "",
              category ? category : []
            )}
          </p>
        </div>

        <div className={Style.right}>
          <label className={Style.label}>payrun</label>
          <p className={Style.para}>
            {" "}
            {getName(
              singleElement?.payRunValueId
                ? String(singleElement?.payRunValueId)
                : "",
              payrun ? payrun : []
            )}
          </p>
        </div>
      </div>
      <div className={Style.taby}>
        <div className={Style.left}>
          <label className={Style.label}>description</label>
          <p className={Style.para}>{singleElement?.description}</p>
        </div>

        <div className={Style.right}>
          <label className={Style.label}>reporting Name</label>
          <p className={Style.para}>{singleElement?.reportingName}</p>
        </div>
      </div>
      <div className={Style.taby}>
        <div className={Style.left}>
          <label className={Style.label}>Effective Start Date</label>
          <p className={Style.para}>
            {singleElement?.effectiveStartDate &&
              convertDateFormatOnly(singleElement?.effectiveStartDate)}
          </p>
        </div>

        <div className={Style.right}>
          <label className={Style.label}>Effective END Date</label>
          <p className={Style.para}>
            {" "}
            {singleElement?.effectiveEndDate &&
              convertDateFormatOnly(singleElement?.effectiveEndDate)}
          </p>
        </div>
      </div>
      <div className={Style.taby}>
        <div className={Style.left}>
          <label className={Style.label}>PROCESSING TYPE</label>
          <p className={Style.para}>{singleElement?.processingType}</p>
        </div>

        <div className={Style.right}>
          <label className={Style.label}>PAY frequency</label>
          <p className={Style.para}>{singleElement?.payFrequency}</p>
        </div>
      </div>
      <div className={Style.taby}>
        <div className={Style.left}>
          <label className={Style.label}>Pay Months</label>
          <p className={Style.para}>
            {singleElement?.selectedMonths &&
            singleElement?.selectedMonths.length > 0
              ? singleElement?.selectedMonths.map((item) => (
                  <React.Fragment key={item}>{item}</React.Fragment>
                ))
              : "N/A"}
          </p>
        </div>

        <div className={Style.right}>
          <label className={Style.label}>Prorate</label>
          <p className={Style.para}>{singleElement?.prorate}</p>
        </div>
      </div>
      <div className={Style.taby}>
        <div className={`${Style.left} ${Style.fix}`}>
          <label className={Style.label}>Status</label>
          <p className={Style.para}>{singleElement?.status}</p>
        </div>

        <div className={`${Style.right} ${Style.fix}`}></div>
      </div>
    </div>
  );
};

export default SingleElementDetails;
