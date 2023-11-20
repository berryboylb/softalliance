/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

import React, { Suspense, useEffect } from "react";
import { useTable } from "react-table";
import {
  faEllipsisH,
  faTrashCan,
  faPen,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Style from "./css/styles.module.css";
import { Sort } from "../../assets";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { LookupValues } from "../../store/reducers/category";
import { getClassification } from "../../store/reducers/classification";
import { getCategory } from "../../store/reducers/category";
import { tableBackgroundColors, tableStatusColors } from "../../constants";
import { convertDateFormat } from "../../utils";
import { useNavigate } from "react-router-dom";
type Props = {
  dataArr: any[];
  columnsArr: {
    Header: string;
    accessor: string;
  }[];
  toggle: () => void;
  handleLinkChange: (val: string | null) => void;
  box: boolean;
  toggleBox: () => void;
  toggleEdit: () => void;
};
const Index: React.FC<Props> = ({
  dataArr,
  columnsArr,
  toggle,
  handleLinkChange,
  box,
  toggleBox,
  toggleEdit,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { category } = useAppSelector((state) => state.category);
  const { classification } = useAppSelector((state) => state.classification);

  useEffect(() => {
    if (!category) dispatch(getCategory(1));
  }, [dispatch, category]);

  useEffect(() => {
    if (!classification) dispatch(getClassification(2));
  }, [dispatch, classification]);

  const getName = (id: string, arr: Array<LookupValues>) => {
    if (!arr || arr.length < 0) return "N/A";
    const item = arr.find((item) => item.id === id);
    if (!item) return "N/A";
    return item.name;
  };
  const data = React.useMemo(() => dataArr, [dataArr]);
  const columns: any = React.useMemo(() => columnsArr, []);
  const [currentIndex, setCurrentIndex] = React.useState<null | number>(null);
  const toggleCurrent = (thing: number | null) => setCurrentIndex(thing);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <Suspense>
      {/* {box && <div onClick={toggleBox} className={Style.pop__}></div>} */}
      <div className={Style.table}>
        <table className={Style.table_main} {...getTableProps()}>
          <thead>
            {headerGroups.map((head) => (
              <tr {...head.getHeaderGroupProps()} className={Style.tr_head}>
                {head.headers.map((column) => (
                  <th className="" {...column.getHeaderProps()}>
                    {column.render("Header")}
                    <img className={Style.title_icon} src={Sort} alt={Sort} />
                  </th>
                ))}

                <th className="">
                  Action
                  <img className={Style.title_icon} src={Sort} alt={Sort} />
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
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={` ${Style.test}${
                          cell.column.id === "status" && cell.value === "active"
                            ? Style.activeCell
                            : Style.inactiveCell
                        }`}
                      >
                        {cell.column.id === "categoryValueId" ? (
                          getName(String(cell.value), category ? category : [])
                        ) : (
                          <>
                            {cell.column.id === "classificationValueId" ? (
                              getName(
                                String(cell.value),
                                classification ? classification : []
                              )
                            ) : (
                              <>
                                {cell.column.id === "status" ? (
                                  <span
                                    className={Style.status_}
                                    style={{
                                      background:
                                        tableBackgroundColors[
                                          cell.value.toLowercase()
                                        ],
                                      color:
                                        tableStatusColors[
                                          cell.value.toLowercase()
                                        ],
                                    }}
                                  >
                                    {cell.value}
                                  </span>
                                ) : (
                                  <>
                                    {cell.column.id === "createdAt"
                                      ? convertDateFormat(cell.value)
                                      : cell.render("Cell")}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </td>
                    );
                  })}
                  <td className={Style.action}>
                    <div className={Style.boss}>
                      <button
                        onClick={() => {
                          toggleBox();
                          toggleCurrent(i);
                        }}
                        className={Style.box}
                      >
                        {" "}
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </button>
                    </div>

                    <div className={Style.bond}>
                      {box && currentIndex === i && (
                        <div className={Style.popup}>
                          <button
                            style={{ color: "#2D416F" }}
                            onClick={() => {
                              navigate(
                                `/elements/element/element-details/${
                                  data[Number(row.id)].id
                                }`
                              );
                              toggleCurrent(null);
                            }}
                          >
                            <FontAwesomeIcon
                              className={`${Style.con} ${Style.edit}`}
                              icon={faEye}
                            />
                            View Element Link
                          </button>
                          <button
                            style={{ color: "#2D416F" }}
                            onClick={() => {
                              toggleCurrent(null);
                              handleLinkChange(data[Number(row.id)].id);
                              toggleBox();
                              toggleEdit();
                            }}
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
                            onClick={() => {
                              toggleCurrent(null);
                              toggle();
                              handleLinkChange(data[Number(row.id)].id);
                            }}
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
