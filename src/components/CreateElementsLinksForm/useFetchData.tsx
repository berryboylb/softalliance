import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { getSubs } from "../../store/reducers/subOrganization";
import { get as getDepts } from "../../store/reducers/department-reducer";
import { get as getJobTitles } from "../../store/reducers/jobtitle";
import { get as getLocations } from "../../store/reducers/location";
import { getEmployeeType } from "../../store/reducers/employeeType";
import { getEmployeeCategory } from "../../store/reducers/employeeCategory";
import {
  getGradeSteps as getSteps,
  get as getGrades,
} from "../../store/reducers/grades-reducer";
import { get as getUnions } from "../../store/reducers/union";
import { get as getHousing } from "../../store/reducers/housing";
import { get as getPensions } from "../../store/reducers/pension";
import { get as getSecurities } from "../../store/reducers/security";
const useFetchData = (
  subId: number | undefined,
  gradeId: number | undefined
) => {
  const dispatch = useAppDispatch();
  const { subOrganization } = useAppSelector((state) => state.subOrganization);
  const { department } = useAppSelector((state) => state.department);
  const { jobtitle } = useAppSelector((state) => state.jobtitle);
  const { location } = useAppSelector((state) => state.location);
  const { employeeType } = useAppSelector((state) => state.employeeType);
  const { employeeCategory } = useAppSelector(
    (state) => state.employeeCategory
  );
  const { grades, steps } = useAppSelector((state) => state.grades);
  const { union } = useAppSelector((state) => state.union);
  const { housing } = useAppSelector((state) => state.housing);
  const { pension } = useAppSelector((state) => state.pension);
  const { security } = useAppSelector((state) => state.security);
  useEffect(() => {
    if (!subOrganization) dispatch(getSubs());
  }, [dispatch, subOrganization]);

  useEffect(() => {
    if (!jobtitle) dispatch(getJobTitles(6));
  }, [dispatch, jobtitle]);

  useEffect(() => {
    if (!location) dispatch(getLocations(7));
  }, [dispatch, location]);

  useEffect(() => {
    if (!employeeType) dispatch(getEmployeeType(4));
  }, [dispatch, employeeType]);

  useEffect(() => {
    if (!employeeCategory) dispatch(getEmployeeCategory(3));
  }, [dispatch, employeeCategory]);

  useEffect(() => {
    if (!grades) dispatch(getGrades());
  }, [dispatch, grades]);

  useEffect(() => {
    if (!union) dispatch(getUnions(8));
  }, [dispatch, union]);

  useEffect(() => {
    if (!housing) dispatch(getHousing(9));
  }, [dispatch, housing]);

  useEffect(() => {
    if (!pension) dispatch(getPensions(10));
  }, [dispatch, pension]);

  useEffect(() => {
    if (!security) dispatch(getSecurities(11));
  }, [dispatch, security]);

  useEffect(() => {
    if (gradeId) dispatch(getSteps(gradeId));
  }, [dispatch, gradeId]);

  useEffect(() => {
    if (subId) {
      console.log("subId");
      dispatch(getDepts(subId));
    } 
  }, [dispatch, subId]);
  return {
    subOrganization,
    department,
    jobtitle,
    location,
    employeeType,
    employeeCategory,
    grades,
    steps,
    union,
    housing,
    pension,
    security,
  };
};

export default useFetchData;
