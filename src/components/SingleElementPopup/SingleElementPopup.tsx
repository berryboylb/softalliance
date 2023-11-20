import Styles from "./css/style.module.css";
import Style from "../singleElementDetails/css/styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../../store/reducers/elementslink-reducer";
import Spinner from "../Spinner/Spinner";
import { useMemo } from "react";
import { convertDateFormatOnly } from "../../utils";
import useFetchData from "../CreateElementsLinksForm/useFetchData";
type Custom = {
  id: string;
  name: string;
  elementId: number;
  suborganizationId: string;
  locationId: string;
  departmentId: string;
  employeeCategoryId: number;
  employeeCategoryValueId: string;
  employeeTypeId: number;
  employeeTypeValueId: string;
  jobTitleId: number;
  grade: string;
  gradeStep: string;
  unionId: number;
  amountType: string;
  amount: number;
  rate: number;
  effectiveStartDate?: string;
  effectiveEndDate?: string;
  status?: "active" | "inactive";
  automate?: "yes" | "no";
  createdAt: string;
  additionalInfo: [
    {
      lookupId: number;
      lookupValueId: number;
    }
  ];
};
const SingleElementPopup = ({
  toggle,
  linkId,
}: {
  toggle: () => void;
  linkId: string | null;
}) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id && linkId) dispatch(getById({ id, elementId: linkId }));
  }, [id, linkId, dispatch]);

  const { singleElementLink, loading } = useAppSelector(
    (state) => state.elementsLink
  );

  const [datas, setDatas] = useState<Custom>();
  const {
    subOrganization,
    department,
    employeeType,
    employeeCategory,
    grades,
    steps: stepper,
    location,
  } = useFetchData(
    singleElementLink?.suborganizationId,
    singleElementLink?.grade
  );
  useEffect(() => {
    const fetchData = async () => {
      if (singleElementLink) {
        const updatedData: Custom = {
          ...singleElementLink,
          departmentId:
            department?.find(
              (item) =>
                Number(item.id) === Number(singleElementLink?.departmentId)
            )?.name || "N/A",
          grade:
            grades?.find(
              (item) => Number(item.id) === Number(singleElementLink?.grade)
            )?.name || "N/A",
          gradeStep:
            stepper?.find(
              (item) => Number(item.id) === Number(singleElementLink?.gradeStep)
            )?.name || "N/A",
          employeeCategoryValueId:
            employeeCategory?.find(
              (item) =>
                Number(item.id) ===
                Number(singleElementLink?.employeeCategoryValueId)
            )?.name || "N/A",
          employeeTypeValueId:
            employeeType?.find(
              (item) =>
                Number(item.id) ===
                Number(singleElementLink?.employeeTypeValueId)
            )?.name || "N/A",
          suborganizationId:
            subOrganization?.find(
              (item) =>
                Number(item.id) === Number(singleElementLink?.suborganizationId)
            )?.name || "N/A",
          locationId:
            location?.find(
              (item) =>
                Number(item.id) === Number(singleElementLink?.locationId)
            )?.name || "N/A",
        };
        setDatas(updatedData);
      }
    };

    fetchData();
  }, [
    singleElementLink,
    department,
    location,
    subOrganization,
    employeeType,
    employeeCategory,
    stepper,
    grades,
  ]);

  const data = useMemo(() => datas, [datas]);
  return (
    <div className={Styles.backdrop}>
      <div className={Styles.bg_}>
        {loading && <Spinner toggle={false} />}
        {!loading && data && (
          <>
            <button className={Styles._cancel} onClick={toggle}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <h1 className={Styles.title}>Element Link Details</h1>

            <div className={Style.taby}>
              <div className={Style.left}>
                <label className={Style.label}>NAME</label>
                <p className={Style.para}>{data?.name}</p>
              </div>

              <div className={Style.right}>
                <label className={Style.label}>sub organization</label>
                <p className={Style.para}>{data?.suborganizationId}</p>
              </div>
            </div>

            <div className={Style.taby}>
              <div className={Style.left}>
                <label className={Style.label}>Department</label>
                <p className={Style.para}>{data?.departmentId}</p>
              </div>

              <div className={Style.right}>
                <label className={Style.label}>Location</label>
                <p className={Style.para}>{data?.locationId}</p>
              </div>
            </div>

            <div className={Style.taby}>
              <div className={Style.left}>
                <label className={Style.label}>Employee Type</label>
                <p className={Style.para}>{data?.employeeTypeValueId}</p>
              </div>

              <div className={Style.right}>
                <label className={Style.label}>Employee Category</label>
                <p className={Style.para}>{data?.employeeCategoryValueId}</p>
              </div>
            </div>

            <div className={Style.taby}>
              <div className={Style.left}>
                <label className={Style.label}>Effective Date</label>
                <p className={Style.para}>
                  {convertDateFormatOnly(data?.createdAt)}
                </p>
              </div>

              <div className={Style.right}>
                <label className={Style.label}>Status</label>
                <p className={Style.para}>{data?.status ? data?.status : 'N/A'}</p>
              </div>
            </div>

            <div className={Style.taby}>
              <div className={Style.left}>
                <label className={Style.label}>GRADE</label>
                <p className={Style.para}>{data?.grade}</p>
              </div>

              <div className={Style.right}>
                <label className={Style.label}>Grade Step</label>
                <p className={Style.para}>{data?.gradeStep}</p>
              </div>
            </div>

            <div className={Style.taby}>
              <div className={Style.left}>
                <label className={Style.label}>Amount Type</label>
                <p className={Style.para}>{data?.amountType}</p>
              </div>

              <div className={Style.right}>
                <label className={Style.label}>Amount</label>
                <p className={Style.para}>
                  {Number(data?.amount).toLocaleString()}
                </p>
              </div>
            </div>

            <div className={Style.taby}>
              <div className={Style.left}>
                <label className={Style.label}>PENSION</label>
                <p className={Style.para}>
                  {data.additionalInfo?.find(
                    (item) => Number(item.lookupId) === 10
                  )?.lookupValueId || "N/A"}
                </p>
              </div>

              <div className={Style.right}>
                <label className={Style.label}>Housing</label>
                <p className={Style.para}>
                  {" "}
                  {data.additionalInfo?.find(
                    (item) => Number(item.lookupId) === 9
                  )?.lookupValueId || "N/A"}
                </p>
              </div>
            </div>

            <div className={Style.taby}>
              <div className={`${Style.left} ${Style.fix}`}>
                <label className={`${Style.label} `}>
                  Effective Start Date
                </label>
                <p className={Style.para}>
                  {" "}
                  {data?.effectiveStartDate
                    ? convertDateFormatOnly(data?.effectiveStartDate)
                    : "N/A"}
                </p>
              </div>

              <div className={`${Style.right} ${Style.fix}`}>
                <label className={Style.label}>Effective End Date</label>
                <p className={Style.para}>
                  {" "}
                  {data?.effectiveEndDate
                    ? convertDateFormatOnly(data?.effectiveEndDate)
                    : "N/A"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SingleElementPopup;
