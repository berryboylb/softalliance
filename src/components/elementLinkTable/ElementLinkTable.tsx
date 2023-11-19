/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

import React, { Suspense, useEffect, useState } from "react";
import { useTable } from "react-table";
import Style from "../Table/css/styles.module.css";
import Styles from "./css/style.module.css";
import { Bin, Pen, Sort } from "../../assets";
import { SubOrganization } from "../../store/reducers/subOrganization";
import { LookupValues } from "../../store/reducers/category";
import useFetchData from "./useFetchData";
import axios from "axios";
import { baseUrl } from "../../constants";
type Props = {
  dataArr: any[];
  columnsArr: {
    Header: string;
    accessor: string;
  }[];
  toggle: () => void;
  handleLinkChange: (val: string | null) => void;
  toggleDeleteConfirm: () => void;
  toggleEdit: () => void;
};

export const getById = async (subId: string, depId: string) => {
  try {
    const res = await axios.get(
      `${baseUrl}/suborganizations/${subId}/departments/${depId}`
    );
    return res.data.data.name;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else if (axios.isAxiosError(err) && err.response?.data?.message) {
      console.log(err.response.data);
      return err.response.data.message;
    }
  }
};
const Index: React.FC<Props> = ({
  dataArr,
  columnsArr,
  toggle,
  handleLinkChange,
  toggleDeleteConfirm,
  toggleEdit,
}) => {
  const [datas, setDatas] = useState(dataArr);
  useEffect(() => {
    const fetchData = async () => {
      if (dataArr) {
        const updatedData = await Promise.all(
          dataArr.map(async (item) => {
            if (item.suborganizationId && item.departmentId) {
              const departmentId = await getById(
                item.suborganizationId,
                item.departmentId
              );
              return {
                ...item,
                departmentId,
              };
            }
            return {
              ...item,
              departmentId: null,
            };
          })
        );
        setDatas(updatedData);
      }
    };

    fetchData();
  }, [dataArr]);
  const { employeeCategory, subOrganization } = useFetchData();
  const data = React.useMemo(() => datas, [datas]);
  const columns: any = React.useMemo(() => columnsArr, []);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const getName = (id: string, arr: Array<SubOrganization>) => {
    if (!arr || arr.length < 0) return "N/A";
    const item = arr.find((item: SubOrganization) => item.id === id);
    if (!item) return "N/A";
    return item.name;
  };

  const getLookupName = (id: string, arr: Array<LookupValues>) => {
    if (!arr || arr.length < 0) return "N/A";
    const item = arr.find((item: LookupValues) => item.id === id);
    if (!item) return "N/A";
    return item.name;
  };
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
                    <img className={Style.title_icon} src={Sort} alt={Sort} />
                  </th>
                ))}

                <th className="">
                  Details
                  <img className={Style.title_icon} src={Sort} alt={Sort} />
                </th>

                <th className="">
                  Actions
                  <img className={Style.title_icon} src={Sort} alt={Sort} />
                </th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr className={Style.tr_body} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className={Style.test}>
                        {cell.column.id === "amount" ? (
                          <> NGN {Number(cell.value).toLocaleString()} </>
                        ) : (
                          <>
                            {cell.column.id === "suborganizationId" ? (
                              getName(
                                String(cell.value),
                                subOrganization ? subOrganization : []
                              )
                            ) : (
                              <>
                                {cell.column.id ===
                                "employeeCategoryValueId" ? (
                                  getLookupName(
                                    String(cell.value),
                                    employeeCategory ? employeeCategory : []
                                  )
                                ) : (
                                  <>
                                    {" "}
                                    {cell.column.id === "departmentId"
                                      ? cell.value
                                        ? cell.render("Cell")
                                        : "N/A"
                                      : cell.render("Cell")}{" "}
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
                    <button
                      className={Styles.details}
                      onClick={() => {
                        toggle();
                        handleLinkChange(data[Number(row.id)].id);
                      }}
                    >
                      view Details
                    </button>
                  </td>
                  <td className={Style.action}>
                    <div className={Styles.actions_}>
                      <button
                        onClick={() => {
                          handleLinkChange(data[Number(row.id)].id);
                          toggleEdit();
                        }}
                      >
                        {" "}
                        <img src={Pen} alt={Pen} />{" "}
                      </button>
                      <button
                        onClick={() => {
                          handleLinkChange(data[Number(row.id)].id);
                          toggleDeleteConfirm();
                        }}
                      >
                        {" "}
                        <img src={Bin} alt={Bin} />{" "}
                      </button>
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
