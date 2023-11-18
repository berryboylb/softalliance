/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import Styles from "../ElementsHeader/css/style.module.css";
import LiveSearch from "../LiveSearch/LiveSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../store/hooks";
import { Elements } from "../../store/reducers/elements-reducer";

export default function ElementsLinkHeader({ toggle }: { toggle: () => void }) {
  const { elements } = useAppSelector((state) => state.elements);
  const [selected, setSelected] = React.useState<Elements>();
  const [searchResults, setSearchResults] =
    React.useState<Array<Elements> | null>([]);
  const handleChange = (e: any) => {
    const { target } = e;
    if (!target.value.trim()) return setSearchResults([]);
    if (elements && elements.length > 0) {
      console.log(elements);
      const filteredValue = elements.filter((result) =>
        result.name.toLowerCase().includes(target.value)
      );
      setSearchResults(filteredValue);
    }
  };
  return (
    <Suspense>
      <div className={Styles.element}>
        <div className={Styles.inner}>
          <LiveSearch
            placeholder="Search for element link"
            results={searchResults as any}
            onChange={handleChange}
            onSelect={(item: any) => {
              console.log(item);
              setSelected(item);
            }}
            value={selected?.name}
            onSubmit={() => {
              if (selected) console.log(selected);
            }}
            renderItem={(item: any) => (
              <p className="text-black ">{item.name}</p>
            )}
          />
        </div>
        <button className={Styles.btn} onClick={toggle}>
          Create Element Link{" "}
          <FontAwesomeIcon className={Styles.plus} icon={faPlus} />
        </button>
      </div>
    </Suspense>
  );
}
