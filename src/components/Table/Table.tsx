/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

import React, { Suspense } from "react";
import { useTable } from "react-table";
import {
  faArrowDownUpLock,
  faEllipsisH,
  faTrashCan,
  faPen,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Style from "./css/styles.module.css";
type Props = {
  dataArr: any[];
  columnsArr: {
    Header: string;
    accessor: string;
  }[];
};
const Index: React.FC<Props> = ({ dataArr, columnsArr }) => {
  const data = React.useMemo(() => dataArr, []);
  const columns: any = React.useMemo(() => columnsArr, []);
  const [box, setBox] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState<null | number>(null);
  const toggleBox = () => setBox((K) => !K);
  const toggleCurrent = (thing: number | null) => setCurrentIndex(thing);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <Suspense>
      <div className={Style.table}>
        <table className={Style.table_main} {...getTableProps()}>
          <thead>
            {headerGroups.map((head) => (
              <tr {...head.getHeaderGroupProps()} className={Style.tr_head}>
                {head.headers.map((column) => (
                  <th className="" {...column.getHeaderProps()}>
                    {column.render("Header")}
                    <FontAwesomeIcon
                      className={Style.title_icon}
                      icon={faArrowDownUpLock}
                    />
                  </th>
                ))}

                <th className="">
                  Action
                  <FontAwesomeIcon
                    className={Style.title_icon}
                    icon={faArrowDownUpLock}
                  />
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i: number) => {
              prepareRow(row);
              return (
                <tr className={Style.tr_body} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    // let cellClassName = "";
                    // if (cell.column.id === "status") {
                    //   // Check the cell value and apply conditional styling
                    //   if (cell.value === "active") {
                    //     cellClassName = Style.activeCell; // Use CSS Modules class
                    //   } else if (cell.value === "inactive") {
                    //     cellClassName = Style.inactiveCell; // Use CSS Modules class
                    //   }
                    // }
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={` ${Style.test}${
                          cell.column.id === "status" && cell.value === "active"
                            ? Style.activeCell
                            : Style.inactiveCell
                        }`}
                      >
                        {cell.render("Cell")}{" "}
                      </td>
                    );
                  })}
                  <td className={Style.action}>
                    <button
                      onClick={() => {
                        toggleBox();
                        toggleCurrent(i);
                      }}
                      className={Style.box}
                    >
                      {" "}
                      <FontAwesomeIcon className="mr-2" icon={faEllipsisH} />
                    </button>
                    <div className={Style.bond}>
                      {box && currentIndex === i && (
                        <div className={Style.popup}>
                          <button
                            style={{ color: "#2D416F" }}
                            onClick={() => toggleCurrent(null)}
                          >
                            {" "}
                            <FontAwesomeIcon
                              className={`${Style.con} ${Style.edit}`}
                              icon={faEye}
                            />
                            View Element Link
                          </button>
                          <button
                            style={{ color: "#2D416F" }}
                            onClick={() => toggleCurrent(null)}
                          >
                            {" "}
                            <FontAwesomeIcon
                              className={`${Style.con} ${Style.edit}`}
                              icon={faPen}
                            />
                            Edit Element
                          </button>
                          <button
                            style={{ color: "#E05453" }}
                            onClick={() => toggleCurrent(null)}
                          >
                            {" "}
                            <FontAwesomeIcon
                              className={`${Style.con} ${Style.view}`}
                              icon={faTrashCan}
                            />
                            Delete Element
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Suspense>
  );
};

export default Index;
