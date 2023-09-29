/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import Styles from "./css/style.module.css";
import LiveSearch from "../LiveSearch/LiveSearch";
import { results } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faStickyNote } from "@fortawesome/free-solid-svg-icons";

export default function EleemntsHeader() {
  const [selectedProfile, setSelectedProfile] =
    React.useState<{
      id: string;
      name: string;
      role: string;
    }>();
  const [searchResults, setSearchResults] =
    React.useState<
      {
        id: string;
        name: string;
      }[]
    >();
  const handleChange = (e:any) => {
    const { target } = e;
    if (!target.value.trim()) return setSearchResults([]);

    const filteredValue = results.filter((result) =>
      result.name.toLowerCase().startsWith(target.value)
    );

    setSearchResults(filteredValue);
  };
  return (
    <Suspense>
      <div className={Styles.element}>
        <div className={Styles.inner}>
          <LiveSearch
            placeholder="Search for element"
            results={searchResults}
            onChange={handleChange}
            onSelect={(item: any) => {
              console.log(item);
              setSelectedProfile(item);
            }}
            value={selectedProfile?.name}
            onSubmit={() => {
              if (selectedProfile) console.log(selectedProfile);
            }}
            renderItem={(item: any) => (
              <p className="text-black ">{item.name}</p>
            )}
          />

          <FontAwesomeIcon className={Styles.iconBig} icon={faStickyNote} />
        </div>
        <button>
          Create Element{" "}
          <FontAwesomeIcon className={Styles.plus} icon={faPlus} />
        </button>
      </div>
    </Suspense>
  );
}
