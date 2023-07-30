import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

function numberRange(start, stop, step = 1) {
  const arrayRange = [start];
  let temp = start;
  while (temp < stop) {
    arrayRange.push(temp += step);
  }
  return arrayRange;
}

/**
 * @param {Number} currentPage
 * @param {Number} totalPages
 * @param {Number} offPages
 * @returns {Array} page in range
 * @example
 * offPages = 3
 * [<<]  [1]  [2]  [3]  [active page]  [1]  [2]  [3] [>>]
 * ------< offPages >-------------------< offPages >-----
 */
function paginationFactory(currentPage, totalPages, offPages = 2) {
  if (Number(totalPages) <= (offPages * 2 + 1) || Number(currentPage) <= (offPages + 1)) {
    return numberRange(
      1,
      (totalPages <= (offPages * 2 + 1)) ? totalPages : (offPages * 2 + 1),
    );
  }
  return numberRange(
    (totalPages - currentPage > offPages)
      ? currentPage - offPages
      : totalPages - (offPages * 2),
    (Number(currentPage) + offPages >= Number(totalPages))
      ? totalPages
      : currentPage + offPages,
  );
}

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const range = paginationFactory(currentPage, totalPages);
  const changePage = pageValue => {
    handlePageChange(pageValue);
  };

  return (
    <nav className="row text-center">
      <div className='col'></div>
      <div
        className={`col-auto rounded rounded-sm py-1 px-3 mx-1 ${(currentPage === 1) ? "text-grey" : "btn-hover-white  cursor-pointer"}`}
        onClick={() => (currentPage !== 1) && changePage(currentPage - 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>

      {range.map(index => (
        <div
          key={index}
          className={`col-auto rounded rounded-sm py-1 px-3 mx-1 ${(currentPage === index) ? "bg-orange text-light fw-bold" : "btn-hover-white cursor-pointer"}`}
          onClick={() => (currentPage !== index) && changePage(index)}
        >
          {index}
        </div>
      ))}

      <div
        className={`col-auto rounded rounded-sm py-1 px-3 mx-1 ${(currentPage < totalPages) ? "btn-hover-white cursor-pointer" : "text-grey"}`}
        onClick={() => (currentPage < totalPages) && changePage(currentPage + 1)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </nav>
  );
};

export { Pagination };
