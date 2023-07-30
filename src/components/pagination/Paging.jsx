const Paging = ({ currentPage, totalPages, changePage }) => {
  const pagingElement = [];
  for (let index = 1; index <= totalPages; index++) {
    pagingElement.push(
      <div className="page-item px-0 pb-1 px-sm-2" key={index}>
        {
          (currentPage === index)
            ? <button type="button" className="btn btn-outline-cyan" disabled>{index}</button>
            : (
              <button
                type="button"
                className="btn btn-neutral"
                onClick={() => changePage(index)}
              >
                {index}
              </button>
            )
        }
      </div>,
    );
  }
  return (
    <>
      {pagingElement}
    </>
  );
};

export { Paging };
