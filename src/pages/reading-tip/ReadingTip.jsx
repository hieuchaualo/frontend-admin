import { useEffect, useState } from "react";
import { usePageTitle } from "../../hooks";
import { getReadingTipById, searchReadingTip } from "../../api";
import { PAGINATION_INIT, debounce, toImgUrl } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { EDITOR_STATE, Editor } from "./components";
import { useNavigate, useSearchParams } from "react-router-dom";


const ReadingTip = ({ pageTitle }) => {
  usePageTitle(pageTitle);
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editorState, setEditorState] = useState(EDITOR_STATE.CREATE)
  const [readingTipsList, setReadingTipsList] = useState(PAGINATION_INIT)
  const [readingTipEditing, setReadingTipEditing] = useState()
  const [keywords, setKeywords] = useState('')

  useEffect(() => {
    const fetchData = async _keywords => {
      if (_keywords !== keywords) setKeywords(_keywords)
      const response = await searchReadingTip(_keywords || undefined);
      if (response?.status === 200) setReadingTipsList(response.data.data);
    }
    debounce('getReadingTipsList', fetchData(searchParams.get('keywords')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleClickShowMore = async () => {
    try {
      const response = await searchReadingTip(keywords || undefined, readingTipsList.currentPage + 1);
      if (response?.status === 200) setReadingTipsList({
        data: [...readingTipsList.data, ...response.data.data.data],
        limit: response.data.data.limit,
        currentPage: response.data.data.currentPage,
        totalPages: response.data.data.totalPages,
      });
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnSearch = event => {
    event.preventDefault()
    const value = event.currentTarget.search.value.trim()
    setKeywords(value)
    setSearchParams({ keywords: value })
  }

  const handleReadingTipPickup = async readingTipId => {
    try {
      const response = await getReadingTipById(readingTipId);
      if (response?.status === 200) {
        setReadingTipEditing(response.data.data);
        setEditorState(EDITOR_STATE.UPDATE)
      }
    } catch (error) {
      console.error(error)
    }

  }

  const changeToCreateMode = () => {
    setEditorState(EDITOR_STATE.CREATE)
  }

  const reloadReadingTipsList = async () => {
    document.getElementById('thumbnail').value = null
    const response = await searchReadingTip(keywords || undefined);
    if (response.status === 200) setReadingTipsList(response.data.data);
  }

  return (
    <div>
      <div className="container py-5">
        <div className="row m-0">
          <div className="col p-0 me-0 me-md-2 mb-2 mb-md-0">
            <div className="rounded rounded-sm p-3 bg-white shadow-sm">
              <div className="row">
                <div className="col-auto fs-1">
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="btn btn-lg btn-outline-secondary"
                    onClick={() => navigate('/', { replace: true })}
                  />
                </div>
                <div className="col">
                  <h1 className="h1 text-orange my-2">
                    <strong>
                      Reading tips
                    </strong>
                  </h1>
                </div>
              </div>
              <div className="my-2">
                <form className="input-group" onSubmit={handleOnSearch}>
                  <label className="input-group-text bg-light" htmlFor='search' >
                    <FontAwesomeIcon icon={faSearch} />
                  </label>
                  <input
                    type="search"
                    className="form-control bg-light"
                    name='search'
                    id='search'
                    autoComplete="off"
                    placeholder="Find by title"
                    defaultValue={keywords}
                  />
                </form>
              </div>

              <div className="my-2 border rounded rounded-sm bg-light" style={{ height: '60vh', overflowY: 'scroll' }}>
                {readingTipsList.data.map(readingTipList => (
                  <div
                    key={readingTipList._id}
                    className={"row m-2 bg-white rounded rounded-sm shadow-hover cursor-pointer"}
                    onClick={() => handleReadingTipPickup(readingTipList._id)}
                  >
                    <div className="col-auto p-2">
                      <img
                        src={toImgUrl(readingTipList.thumbnail)}
                        alt="thumbnail"
                        height={'90px'}
                        width={'90px'}
                        className="rounded rounded-lg"
                        draggable='false'
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col text-start fw-bold p-2">
                      <p>
                        {readingTipList.title}
                      </p>
                      <footer className="blockquote-footer">{readingTipList.creator.name}</footer>
                    </div>
                  </div>
                ))}

                {(readingTipsList.currentPage < readingTipsList.totalPages) &&
                  < div className="row m-2">
                    <div
                      className="btn btn-orange text-light"
                      onClick={handleClickShowMore}
                    >
                      Show more
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xxl-7 rounded rounded-sm p-3 bg-white shadow-sm">
            <Editor
              reloadReadingTipsList={reloadReadingTipsList}
              changeToCreateMode={changeToCreateMode}
              readingTipInit={editorState === EDITOR_STATE.UPDATE && readingTipEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  ReadingTip
}
