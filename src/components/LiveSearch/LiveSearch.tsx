import React, { Suspense, useEffect } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Style from "./css/style.module.css"

interface Props<T> {
  results?: T[];
  renderItem(item: T): JSX.Element;
  onChange?: React.ChangeEventHandler;
  onSelect?: (item: T) => void;
  onSubmit?: () => void;
  value?: string;
  placeholder: string
}
const LiveSearch = <T extends object>({
  results = [],
  renderItem,
  onChange,
  onSelect,
  onSubmit,
  value,
  placeholder,
}: Props<T>): JSX.Element => {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const [showResults, setShowResults] = React.useState<boolean>(false);
  const [defaultValue, setDefaultValue] = React.useState<string>("");

  const handleSelection = (selectedIndex: number) => {
    const selectedItem = results[selectedIndex];
    if (!selectedItem) return resetSearchComplete();
    onSelect && onSelect(selectedItem);
    resetSearchComplete();
  };

  const resetSearchComplete = React.useCallback(() => {
    setFocusedIndex(-1);
    setShowResults(false);
  }, []);
  const resultContainer = React.useRef<HTMLDivElement>(null);
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const { key } = e;
    let nextIndexCount = 0;

    //move down
    if (key === "ArrowDown")
      nextIndexCount = (focusedIndex + 1) % results.length;

    //move up
    if (key === "ArrowUp")
      nextIndexCount = (focusedIndex + results.length - 1) % results.length;

    //hide results
    if (key === "Escape") {
      resetSearchComplete();
    }

    //select current item
    if (key === "Enter") {
      e.preventDefault();
      handleSelection(focusedIndex);
    }
    setFocusedIndex(nextIndexCount);
  };

  type changehandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changehandler = (e) => {
    setDefaultValue(e.target.value);
    onChange && onChange(e);
  };

  useEffect(() => {
    if (!resultContainer.current) return;
    resultContainer.current.scrollIntoView({ block: "center" });
  }, [focusedIndex]);

  useEffect(() => {
    if (results.length > 0 && !showResults) setShowResults(true);
    if (results.length <= 0) setShowResults(false);
  }, [results]);

  useEffect(() => {
    if (value) {
      setDefaultValue(value);
    }
  }, [value]);

  return (
    <Suspense>
      <div className={Style.search}>
        <div
          tabIndex={1}
          onBlur={resetSearchComplete}
          onKeyDown={handleKeyDown}
          className="relative  w-full lg:w-auto"
        >
          <div className={Style.input_cont}>
            <input
              type="text"
              value={defaultValue}
              onChange={handleChange}
              className={Style.input}
              placeholder={placeholder}
            />

            <button onClick={onSubmit} className={Style.btn}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          {/* search results container */}
          {showResults && (
            <div className="absolute mt-1 w-full p-2 z-[5] bg-white text-black shadow-lg rounded-bl rounded-br max-h-56 overflow-y-auto">
              {results.map((item, i: number) => (
                <div
                  className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                  onMouseDown={() => handleSelection(focusedIndex)}
                  key={i}
                  ref={i === focusedIndex ? resultContainer : null}
                  style={{
                    background: i === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                  }}
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default LiveSearch;
