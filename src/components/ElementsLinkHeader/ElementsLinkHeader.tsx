/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import Styles from "../ElementsHeader/css/style.module.css";
import LiveSearch from "../LiveSearch/LiveSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../store/hooks";
import { ElementsLink } from "../../store/reducers/elementslink-reducer";
type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
export default function ElementsLinkHeader({
  toggle,
  handleSelect,
  selected,
}: {
  toggle: () => void;
  selected: ElementsLink | undefined;
  handleSelect: (val: ElementsLink | undefined) => void;
}) {
  const { elementsLink } = useAppSelector((state) => state.elementsLink);
  const [searchResults, setSearchResults] =
    React.useState<Array<ElementsLink> | null>([]);

  const handleChange: changeHandler = (e) => {
    const { target } = e;
    if (!target.value.trim()) return setSearchResults([]);
    if (selected) handleSelect(undefined);
    if (elementsLink && elementsLink.length > 0) {
      const filteredValue = elementsLink.filter((result) =>
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
            placeholder="Search for element link"
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
        </div>
        <button className={Styles.btn} onClick={toggle}>
          Create Element Link{" "}
          <FontAwesomeIcon className={Styles.plus} icon={faPlus} />
        </button>
      </div>
    </Suspense>
  );
}
