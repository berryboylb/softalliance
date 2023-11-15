import  { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getSubs } from "../../store/reducers/subOrganization";
import { getEmployeeCategory } from "../../store/reducers/employeeCategory";
// import { get } from "../../store/reducers/department-reducer";
const useFetchData = () => {
  const dispatch = useAppDispatch();

//   const { department } = useAppSelector((state) => state.department);
  const { employeeCategory } = useAppSelector(
    (state) => state.employeeCategory
  );
  const { subOrganization } = useAppSelector((state) => state.subOrganization);

  useEffect(() => {
    if (!subOrganization) dispatch(getSubs());
  }, [dispatch, subOrganization]);

  useEffect(() => {
    if (!employeeCategory) dispatch(getEmployeeCategory(3));
  }, [dispatch, employeeCategory]);
    
    // useEffect(() => {
    //   if (!department) dispatch(get(3));
    // }, [dispatch, department]);
  return { employeeCategory, subOrganization };
};

export default useFetchData;
