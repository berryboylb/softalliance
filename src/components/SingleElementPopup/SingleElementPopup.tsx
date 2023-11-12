import Styles from "./css/style.module.css";
import Style from "../singleElementDetails/css/styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../../store/reducers/elementslink-reducer";
import Spinner from "../Spinner/Spinner";
import { baseUrl } from "../../constants";
import axios from "axios";
import { useMemo } from "react";
import { convertDateFormatOnly } from "../../utils";

const department = async (subId: string, depId: string) => {
  try {
    const res = await axios.get(
      `${baseUrl}/suborganizations/${subId}/departments/${depId}`
      );
     
    return res.data.data.name;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      console.log(err.response.data);
      return err.response.data.message;
    }
  }
};
const subOrganization = async (id: string) => {
  try {
    const res = await axios.get(`${baseUrl}/suborganizations/${id}`);
    return res.data.data.name;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      console.log(err.response.data);
      return err.response.data.message;
    }
  }
};

const lookoup = async (main: string, sub: string) => {
  try {
    const res = await axios.get(
      `${baseUrl}/lookups/${main}/lookupvalues/${sub}`
      );
       console.log("hdshdh",res.data);
    return res.data.data.name;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      console.log(err.response.data);
      return err.response.data.message;
    }
  }
};

const grade = async (id: string) => {
  try {
    const res = await axios.get(`${baseUrl}/grade/${id}`);
    return res.data.data.name;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      console.log(err.response.data);
      return err.response.data.message;
    }
  }
};
const gradeStep = async (gradeId: string, id: string) => {
  try {
    const res = await axios.get(`${baseUrl}/grade/${gradeId}/gradesteps/${id}`);
    return res.data.data.name;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      console.log(err.response.data);
      return err.response.data.message;
    }
  }
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

  const [datas, setDatas] = useState(singleElementLink);

  useEffect(() => {
    const fetchData = async () => {
        if (singleElementLink) {
          console.log("hi", singleElementLink);
        const deptValue = await department(
          String(singleElementLink.suborganizationId),
          String(singleElementLink.departmentId)
        );
        const gradeValue = await grade(String(singleElementLink.grade));
        const gradeStepValue = await gradeStep(
          String(singleElementLink.grade),
          String(singleElementLink.gradeStep)
        );

        const categoryValue = await lookoup(
          String(singleElementLink.employeeCategoryId),
          String(singleElementLink.employeeCategoryValueId)
        );

        const typeValue = await lookoup(
          String(singleElementLink.employeeTypeId),
          String(singleElementLink.employeeTypeValueId)
        );

        const subValue = await subOrganization(
          String(singleElementLink.suborganizationId)
        );
        const updatedData = {
          ...singleElementLink,
          departmentId: deptValue ? deptValue : "N/A",
          grade: gradeValue ? gradeValue : "N/A",
          gradeStep: gradeStepValue ? gradeStepValue : "N/A",
          employeeCategoryValueId: categoryValue ? categoryValue : "N/A",
          employeeTypeValueId: typeValue ? typeValue : "N/A",
          suborganizationId: subValue ? subValue : "N/A",
        };
        setDatas(updatedData);
      }
    };

    fetchData();
  }, [singleElementLink]);

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
                <p className={Style.para}>{data?.status}</p>
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
                <p className={Style.para}>N/A</p>
              </div>

              <div className={Style.right}>
                <label className={Style.label}>Housing</label>
                <p className={Style.para}>N/A</p>
              </div>
            </div>

            <div className={Style.taby}>
              <div className={`${Style.left} ${Style.fix}`}>
                <label className={`${Style.label} `}>
                  Effective Start Date
                </label>
                <p className={Style.para}>
                  {" "}
                  {convertDateFormatOnly(data?.effectiveStartDate)}
                </p>
              </div>

              <div className={`${Style.right} ${Style.fix}`}>
                <label className={Style.label}>Effective End Date</label>
                <p className={Style.para}>
                  {" "}
                  {convertDateFormatOnly(data?.effectiveEndDate)}
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
