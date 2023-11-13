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
  const data = React.useMemo(() => dataArr, []);
  const columns: any = React.useMemo(() => columnsArr, []);
  const [currentIndex, setCurrentIndex] = React.useState<null | number>(null);
  const toggleCurrent = (thing: number | null) => setCurrentIndex(thing);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <Suspense>
      {box && <div onClick={toggleBox} className={Style.pop__}></div>}
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
                                        tableBackgroundColors[cell.value],
                                      color: tableStatusColors[cell.value],
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
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam, recusandae, harum voluptatem porro vitae, earum exercitationem sed maxime aspernatur illum corrupti? Voluptatibus, maxime. Accusamus quisquam distinctio explicabo sunt et eos.
        Nemo voluptates accusamus velit cum corrupti officia ipsum non eligendi. Rem cumque ea, est quam qui, ipsa illo quos temporibus ipsum provident commodi omnis maiores maxime aperiam animi eum dicta?
        Quaerat adipisci esse reiciendis aliquid, fuga architecto ipsam, nostrum quisquam sunt deserunt deleniti dicta vel assumenda! Voluptatum voluptatem culpa, perspiciatis facere atque incidunt ex quos deserunt, sunt saepe quo velit.
        Eveniet, assumenda, laudantium odit laborum placeat saepe aspernatur dolorem minima quia unde nostrum veniam harum delectus eaque vitae nihil ab excepturi asperiores quibusdam fugiat praesentium, incidunt quo autem qui. Aspernatur.
        Soluta nihil in aliquam sequi repellendus sapiente, delectus ducimus corporis neque reiciendis error, voluptate repellat corrupti esse odit nobis dolorum harum recusandae officiis ad laborum suscipit modi expedita! Reiciendis, omnis.
        Tenetur fuga quibusdam eius magni dolore, quaerat culpa voluptatibus commodi iste saepe perspiciatis blanditiis dolor illo corrupti esse reprehenderit molestias placeat necessitatibus quasi maxime error voluptatem rerum! Consequuntur, magni eos!
        Laudantium earum iste enim reprehenderit, ex quisquam molestias? Repellendus voluptatibus tempore tenetur harum blanditiis ipsam, debitis vel libero possimus fugit explicabo voluptate dolorum ex enim accusamus! Magni repudiandae ad quod.
        Autem in ut aspernatur placeat explicabo accusamus quos totam sint, dignissimos debitis corrupti odit nemo, minima quis blanditiis magnam natus quod non odio amet! Numquam itaque soluta minima natus nemo.
        Eaque facere corrupti maiores, numquam molestias ad quaerat repellendus veritatis quod error, quisquam quidem quibusdam id odit animi quam delectus laudantium labore tenetur voluptatem beatae quis cupiditate eum? Beatae, facilis.
        Vero quas quaerat sint magni nesciunt adipisci expedita dicta debitis repellat! Porro sint distinctio consequuntur officiis corrupti, maxime iste blanditiis veritatis quae sapiente, a autem consectetur. Incidunt laudantium mollitia officia?
        Harum excepturi, ab distinctio iusto doloremque dolore nihil blanditiis dolorem tenetur eaque maxime perspiciatis voluptate hic consequatur earum consectetur impedit eveniet neque veniam, molestias alias sed quae quasi reprehenderit. Quam.
        Quidem, ullam eos? Eos, architecto magni a, ex, hic culpa maiores minus explicabo at sint tenetur repudiandae asperiores tempora tempore illo reprehenderit! Ad similique, tenetur nihil accusantium blanditiis veritatis dicta!
        Doloribus, tempora obcaecati! Dolor, rerum non? Ducimus error tenetur facere quo nobis non aliquid dolor eaque itaque beatae, in obcaecati ipsa deserunt ratione id natus? Aliquam veniam molestias maiores nesciunt?
        Hic quis repellat labore totam culpa cumque mollitia pariatur dolorem itaque aspernatur natus aut, inventore maiores aperiam perferendis quidem voluptatem quasi quos deserunt! Maxime omnis et alias, odit eius harum.
        Praesentium rerum nemo doloribus ex, dolores maiores possimus voluptatum nesciunt molestias provident placeat atque sapiente fuga dolorem totam libero magni obcaecati sed tempore. Doloribus optio fugiat dolorem itaque ipsam non.
        Ipsa eos aspernatur saepe fugit neque quidem ad ea dignissimos minus incidunt aliquid, sit molestiae id accusamus porro commodi tenetur, odio quos distinctio suscipit ex. Architecto neque explicabo dicta sit.
        Necessitatibus fugiat ex rem cum voluptates, fuga molestiae earum enim eveniet est pariatur inventore. Officiis ullam, molestiae suscipit, neque fugiat, totam debitis nobis laudantium officia maxime nesciunt accusantium harum consequuntur!
        Amet reprehenderit, optio nisi eaque ullam impedit eos est fugiat veniam sapiente at magni dolor? Tempore dolorem alias expedita nam esse. Dolores dolor voluptates laborum doloribus itaque quisquam corporis quis!
        At accusantium similique accusamus necessitatibus. Excepturi dolores aperiam, error expedita eligendi iste, ut fuga et illum blanditiis voluptas nesciunt minus quam, possimus nostrum veniam enim est provident ex beatae suscipit.
        Saepe, dignissimos repellendus! Ad reiciendis cumque nisi quasi eos necessitatibus tenetur voluptatum corporis deserunt quo! Pariatur ut debitis sed vel quo facilis omnis nulla vero non laudantium saepe, doloremque obcaecati!
        Libero delectus non, molestiae veritatis necessitatibus facere nostrum, quasi doloribus at fuga sint autem modi voluptatibus! Molestias, reiciendis! Fugiat voluptas optio doloribus incidunt? Facere illo, ea quaerat consectetur nostrum reprehenderit!
        Vel inventore, dicta animi sed officia magni quos aut possimus nulla doloremque ducimus velit eum enim quas cupiditate non iusto repellendus vero minus reiciendis ab itaque, earum distinctio voluptatibus. Amet.
        Doloremque, voluptas provident. Autem quaerat tempora, quasi nemo dolorem, non odit unde et temporibus est veritatis officia delectus cum quis ullam aliquid sint sit reprehenderit eius, quisquam eveniet soluta itaque.
        Exercitationem, quasi sunt, laboriosam similique aspernatur incidunt alias illum rerum magni, labore ipsum delectus sapiente. Quis dolore doloribus eveniet hic sapiente ut modi, quam illum consectetur itaque aut esse quisquam?
        Illum maiores, recusandae debitis placeat provident magnam consequatur ea tempore ipsum laudantium quod totam nam fugiat, deleniti architecto? Placeat quas dolores esse dolor ad. Laborum omnis totam fugit iste provident!
        Facere molestiae ipsum expedita voluptates obcaecati earum nobis odit. Corrupti, harum suscipit! Cum voluptates autem eligendi, doloribus error fuga omnis exercitationem voluptas aspernatur aperiam odit nostrum laudantium. Reprehenderit, pariatur inventore!
        Adipisci tenetur quisquam tempore sed ipsa dolorem aliquam corporis. Eligendi sapiente minima iure, vitae in quod, magnam commodi excepturi veritatis ut harum labore quae! Dolore esse nobis expedita voluptate totam.
        Dolorem nobis adipisci ullam suscipit ipsum possimus explicabo magni eos aliquam laudantium placeat doloremque nihil, earum quo laborum quod, vel porro. Aperiam odio culpa eveniet. Placeat sint soluta illo debitis?
        Cum iusto, enim excepturi asperiores facere laboriosam atque non laborum sapiente illo impedit. Modi voluptatum, perferendis adipisci, tempore eius aspernatur dolorum consequuntur velit temporibus ullam facere, sed consequatur nobis! Magni.
        Alias sapiente dolor provident accusantium culpa exercitationem dignissimos, in aliquam voluptates obcaecati aliquid corrupti iure, reiciendis assumenda modi error dolore voluptatem harum fugiat velit eum omnis quas ea. Dolores, nisi.
        Autem fugit ad nesciunt rem, deserunt praesentium natus atque aliquid molestias consectetur ducimus debitis eius itaque impedit excepturi perferendis ipsa vitae eveniet adipisci. Unde hic aut consectetur dolorem totam eaque.
        Illum eveniet consectetur nisi tenetur. Consequuntur omnis mollitia exercitationem ipsa nihil incidunt maiores blanditiis rem laudantium velit nemo veniam ad pariatur eum, cumque dolorum totam accusantium ipsum eligendi sequi nobis.
        Veniam corrupti totam reprehenderit beatae quam quisquam officia tenetur illum alias iure odio inventore sit similique deleniti quasi ullam ratione impedit non temporibus repudiandae ipsa, tempore sint, blanditiis culpa. Quisquam.
        Iste veritatis iusto perspiciatis illo tempore labore ab, pariatur in numquam velit delectus eligendi voluptates culpa facilis, omnis laborum et. Repudiandae molestias magni nobis culpa dolor voluptatum neque, optio recusandae.
        Quae cum dolor nemo architecto, rerum, modi quas atque animi nisi temporibus illo. Harum sapiente porro impedit, voluptates deleniti dignissimos delectus, architecto soluta nostrum hic, magni optio earum perspiciatis maiores!
        Itaque suscipit blanditiis animi id obcaecati assumenda fugiat aliquid! Sunt deleniti error molestiae. Odio ad soluta explicabo sit expedita architecto autem nostrum provident veniam eveniet, odit eos aliquid. Minima, inventore?
        Explicabo voluptate dolor quia sed necessitatibus sequi ipsum laudantium a, voluptatibus veniam minus, ea quo illum possimus nihil architecto officia rem, debitis magnam totam iure modi eveniet delectus veritatis. Quibusdam.
        Error accusantium, animi deleniti dolor, aut enim ea tenetur, sapiente veritatis maxime expedita! Obcaecati natus eos aliquam earum vitae minima sint, accusantium consectetur autem! Architecto quis aut inventore corporis laudantium.
        Ipsum delectus unde dolorum necessitatibus. Quaerat soluta quibusdam necessitatibus, enim dolore laboriosam sequi perspiciatis, ipsum doloribus minima non nisi qui consectetur repudiandae placeat praesentium adipisci nobis, ipsa odio unde fugiat!
        Et esse necessitatibus accusantium, nihil voluptatum excepturi magnam ducimus minus exercitationem minima! Esse similique molestiae maxime ut alias, asperiores eligendi quae est necessitatibus placeat distinctio culpa voluptatem vel, voluptates animi?
        Doloribus eligendi, vel blanditiis ullam in officia? Dolor, quaerat. Consequatur praesentium cum, dolorem cumque atque nulla excepturi ullam esse fugit ea tempore culpa, deleniti earum. Non laboriosam modi autem pariatur!
        Blanditiis voluptatibus sunt obcaecati. Dolores possimus ipsa incidunt delectus ullam cum nisi a nemo expedita, aperiam dicta debitis ad harum inventore! Asperiores, aliquam corporis perferendis corrupti illo deleniti praesentium eligendi.
        Ullam sint adipisci qui dolorum. Laudantium voluptatibus maxime optio, commodi quis nesciunt quam excepturi magnam error, vel corporis necessitatibus labore, expedita alias non repudiandae officia odio recusandae aspernatur. Eaque, placeat!
        Neque repellat fugit maiores consequuntur molestiae unde eius ea cupiditate voluptas, corrupti distinctio itaque, nulla hic totam odio minus ipsum laborum quaerat quae. Totam sapiente illum rerum eveniet, ducimus veritatis.
        Distinctio non dolore enim odio quod eius accusantium assumenda maiores ducimus, asperiores corporis atque delectus voluptatum qui ut nihil libero earum sequi ipsam ipsum quis nesciunt nulla accusamus possimus! Rem!
        Sint sunt asperiores nisi dolorum molestiae at minima quod aut accusantium quidem, eaque, vel nam. Itaque, accusamus? Soluta illum labore, pariatur nemo cumque eaque commodi voluptatem quibusdam magnam quas amet!
        Cupiditate magni libero, officia ab, laboriosam sequi quis placeat, at nobis quam alias. Facere, libero, accusantium debitis nobis dolorem et blanditiis ipsum aut earum dolorum, deleniti ab ut id excepturi!
        Ea deleniti quidem dignissimos omnis quod minima repudiandae cumque sit, mollitia animi laboriosam, unde maxime architecto, sed magnam ad! Cupiditate accusamus reiciendis ea nisi id, dicta iusto aliquid facere velit?
        Ipsa qui provident aliquam voluptate. Eius, consequatur distinctio! Eius rem nostrum maxime facilis ipsa. Dolor mollitia ipsum nobis facere. Assumenda placeat voluptate earum cum deserunt quod dicta nulla similique eius.
        Reprehenderit non facilis quis hic ad laborum quasi iste, vero eius nulla esse quo accusamus consequatur delectus rem dolore consequuntur eum exercitationem. Qui maxime molestiae impedit, libero soluta repellat! Soluta?
      </div>
    </Suspense>
  );
};

export default Index;
