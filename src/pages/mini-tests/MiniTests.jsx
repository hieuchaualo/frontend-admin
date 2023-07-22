import { useEffect, useState } from "react";
import { usePageTitle, useSafeNavigateBack } from "../../hooks";
import { getMiniTestById, searchMiniTest } from "../../api";
import { debounce, toImgUrl } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { EDITOR_STATE, Editor } from "./components";
import { useSearchParams } from "react-router-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const miniTestsListInit = {
  data: [],
  limit: 12,
  currentPage: 1,
  totalPages: 1
}

const MiniTests = ({ pageTitle }) => {
  usePageTitle(pageTitle);
  const navigateBack = useSafeNavigateBack()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editorState, setEditorState] = useState(EDITOR_STATE.CREATE)
  const [miniTestsList, setMiniTestsList] = useState(miniTestsListInit)
  const [miniTestEditing, setMiniTestEditing] = useState()
  const [keywords, setKeywords] = useState('')

  useEffect(() => {
    const fetchData = async _keywords => {
      if (_keywords !== keywords) setKeywords(_keywords)
      const response = await searchMiniTest(_keywords || undefined);
      if (response.status === 200) setMiniTestsList(response.data.data);
    }
    debounce('getMiniTestsList', fetchData(searchParams.get('keywords')));
  }, [searchParams])

  const handleOnSearch = event => {
    event.preventDefault()
    const value = event.currentTarget.search.value.trim()
    setKeywords(value)
    setSearchParams({ keywords: value })
  }

  const handleMiniTestPickup = async miniTestId => {
    const response = await getMiniTestById(miniTestId);
    setEditorState(EDITOR_STATE.UPDATE)
    if (response.status === 200) setMiniTestEditing(response.data.data);
  }

  const changeToCreateMode = () => {
    setEditorState(EDITOR_STATE.CREATE)
  }

  const reloadMiniTestsList = async () => {
    document.getElementById('thumbnail').value = null
    const response = await searchMiniTest(keywords || undefined);
    if (response.status === 200) setMiniTestsList(response.data.data);
  }

  return (
    <div>
      <div className="container py-5">
        <div className="row m-0">
          <div className="col p-0 me-0 me-md-2 mb-2 mb-md-0">
            <div className="rounded rounded-sm p-3 bg-white shadow-sm">
              <div className="row">
                <div className="col-auto fs-1">
                  <FontAwesomeIcon icon={faChevronLeft} className="btn btn-lg btn-outline-secondary" onClick={navigateBack}/>
                </div>
                <div className="col">
                  <h1 className="h1 text-orange my-2">
                    <strong>
                      Mini tests
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
                {miniTestsList.data.map(miniTestList => (
                  <div
                    key={miniTestList._id}
                    className="row m-2 bg-white rounded rounded-sm shadow-hover cursor-pointer"
                    onClick={() => handleMiniTestPickup(miniTestList._id)}
                  >
                    <div className="col-auto p-2">
                      <img
                        src={toImgUrl(miniTestList.thumbnail)}
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
                        {miniTestList.title}
                      </p>
                      <footer className="blockquote-footer">{miniTestList.creator.name}</footer>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xxl-7 rounded rounded-sm p-3 bg-white shadow-sm">
            <Editor
              reloadMiniTestsList={reloadMiniTestsList}
              changeToCreateMode={changeToCreateMode}
              miniTestInit={editorState === EDITOR_STATE.UPDATE && miniTestEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  MiniTests
}
