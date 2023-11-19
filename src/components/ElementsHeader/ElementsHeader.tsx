/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import Styles from "./css/style.module.css";
import LiveSearch from "../LiveSearch/LiveSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Filter } from "../../assets";
import { useAppSelector } from "../../store/hooks";
import { Elements } from "../../store/reducers/elements-reducer";
type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
export default function EleemntsHeader({
  toggle,
  handleSelect,
  selected,
}: {
  toggle: () => void;
  selected: Elements | undefined;
  handleSelect: (val: Elements | undefined) => void;
}) {
  const { elements } = useAppSelector((state) => state.elements);
  const [searchResults, setSearchResults] =
    React.useState<Array<Elements> | null>([]);
  const handleChange: changeHandler = (e) => {
    const { target } = e;
    if (!target.value.trim()) return setSearchResults([]);
    if (selected) handleSelect(undefined);
    if (elements && elements.length > 0) {
      const filteredValue = elements.filter((result) =>
        result.name.toLowerCase().includes(target.value.toLowerCase())
      );
      setSearchResults(filteredValue);
    }
  };
  return (
    <Suspense>
      <div className={Styles.element}>
        <div className={Styles.inner}>
          <LiveSearch
            placeholder="Search for element"
            results={searchResults as any}
            onChange={handleChange}
            onSelect={(item: any) => {
              console.log(item);
              handleSelect(item);
            }}
            value={selected?.name}
            onSubmit={() => {
              if (selected) console.log(selected);
            }}
            renderItem={(item: any) => (
              <p className="text-black ">{item.name}</p>
            )}
          />

          <button className={Styles.filter_}>
            <img src={Filter} alt={Filter} />
          </button>
        </div>
        <button className={Styles.btn} onClick={toggle}>
          Create Element{" "}
          <FontAwesomeIcon className={Styles.plus} icon={faPlus} />
        </button>
      </div>
    </Suspense>
  );
}
