import  { useEffect } from "react";
import SingleElementDetails from "../../../components/singleElementDetails/singleElementDetails";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getById } from "../../../store/reducers/elements-reducer";
import Spinner from "../../../components/Spinner/Spinner";
import ElementLinks from "../../../components/ElementLinks/ElementLinks";
const SingleElement = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { loading, singleElement } = useAppSelector((state) => state.elements);
  useEffect(() => {
    if (id) dispatch(getById(id));
  }, [id, dispatch]);

  return (
    <div>
      {loading && <Spinner />}
      {!loading && singleElement && <SingleElementDetails />}
      <ElementLinks />
    </div>
  );
};

export default SingleElement;
