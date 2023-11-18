import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Style from "./css/style.module.css";

const Select = ({
  currentPage,
  total,
  paginate,
}: {
  currentPage: number;
  total: Array<number>;
  paginate: (val: number) => void;
}) => {
  return (
    <div className={Style.select_}>
      <span>Showing</span>
      <select
        name=""
        id=""
        onChange={(e) => {
          paginate(Number(e.target.value));
        }}
        value={currentPage}
      >
        {total &&
          total.length > 0 &&
          total
            .map((item) => <option value={item}>{item}</option>)}
      </select>
      <span>out of {total?.length}</span>
    </div>
  );
};

const Numbers = ({
  totalPages,
  currentPage,
  previousPage,
  nextPage,
  paginate,
}: {
  totalPages: Array<number>;
  currentPage: number;
  previousPage: () => void;
  nextPage: () => void;
  paginate: (val: number) => void;
    }) => {
    const visiblePages = 3;

     const renderPageNumbers = () => {
       const startPage = Math.max(
         1,
         currentPage - Math.floor(visiblePages / 2)
       );
       const endPage = Math.min(
         startPage + visiblePages - 1,
         totalPages[totalPages.length - 1]
       );

       const pages = [];
       for (let i = startPage; i <= endPage; i++) {
         pages.push(
           <button
             style={currentPage === i ? { color: "#213F7D", opacity: 1 } : {}}
             key={i}
             className={currentPage === i ? Style.active : ""}
             onClick={() => paginate(i)}
           >
             {i}
           </button>
         );
       }

       if (startPage > 1) {
         pages.unshift(
           <span key="start" className={Style.dots}>
             ...
           </span>
         );
       }

       if (endPage < totalPages[totalPages.length - 1]) {
         pages.push(
           <span key="end" className={Style.dots}>
             ...
           </span>
         );
       }

       return pages;
     };
  return (
    <div className={Style.numbers_}>
      <button onClick={previousPage}>
        {" "}
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {renderPageNumbers()}
      {/* {totalPages.map((number) => (
        <button
          style={currentPage === number ? { color: "#213F7D", opacity: 1 } : {}}
          key={number}
          className={currentPage === number ? Style.active : ""}
          onClick={() => paginate(number)}
        >
          {number}
        </button>
      ))} */}
      {currentPage < totalPages?.length && (
        <button onClick={nextPage}>
          {" "}
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}
    </div>
  );
};

type Props = {
  postsPerPage: number;
  totalPosts: number;
  previousPage: () => void;
  nextPage: () => void;
  currentPage: number;
  paginate: (value: number) => void;
};
const Pagination: React.FC<Props> = ({
  postsPerPage,
  totalPosts,
  previousPage,
  nextPage,
  currentPage,
  paginate,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className={Style.pagination}>
      <Select
        currentPage={currentPage}
        total={pageNumbers}
        paginate={paginate}
      />
      <Numbers
        totalPages={pageNumbers}
        currentPage={currentPage}
        previousPage={previousPage}
        nextPage={nextPage}
        paginate={paginate}
      />
    </div>
  );
};

export default Pagination;
