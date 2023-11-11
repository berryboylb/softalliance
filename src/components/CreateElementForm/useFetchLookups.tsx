import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { getCategory } from "../../store/reducers/category";
import { getClassification } from "../../store/reducers/classification";
import { getPayrun } from "../../store/reducers/payrun";
const useDataFetching = () => {
  const dispatch = useAppDispatch();
  const { category } = useAppSelector((state) => state.category);
  const { classification } = useAppSelector((state) => state.classification);
  const { payrun } = useAppSelector((state) => state.payrun);

  useEffect(() => {
    if (!category) dispatch(getCategory(1));
  }, [dispatch, category]);

  useEffect(() => {
    if (!classification) dispatch(getClassification(2));
  }, [dispatch, classification]);

  useEffect(() => {
    if (!payrun) dispatch(getPayrun(5));
  }, [dispatch, payrun]);

  return { category, classification, payrun };
};

export default useDataFetching;
