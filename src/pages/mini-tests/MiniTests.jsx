import { useEffect, useState } from "react";
import { usePageTitle } from "../../hooks";
import { getMiniTestById, searchMiniTest } from "../../api";
import { debounce, toImgUrl } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { EDITOR_STATE, Editor } from "./components";
import { useSearchParams } from "react-router-dom";

const miniTestsListInit = {
  data: [],
  limit: 12,
  currentPage: 1,
  totalPages: 1
}

const MiniTests = ({ pageTitle }) => {
  usePageTitle(pageTitle);
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

  const handleMiniTestDrop = () => {
    setEditorState(EDITOR_STATE.CREATE)
  }

  const resetSearch = () => {
    setKeywords('')
    setSearchParams()
  }

  return (
    <div style={{ background: 'url("/images/background.jpg")', backgroundSize: 'auto 100vh', minHeight: '100vh' }}>
      <div style={{ backdropFilter: 'blur(10px)', minHeight: '100vh' }}>
        <div className="container py-5">
          <div className="row m-0">
            <div className="col text-center p-0 me-0 me-md-2 mb-2 mb-md-0">
              <div className="rounded rounded-sm p-3 bg-light">
                <h1 className="h1 text-orange my-2">
                  <strong>
                    Mini tests management
                  </strong>
                </h1>
                <div className="my-2">
                  <form className="input-group" onSubmit={handleOnSearch}>
                    <label className="input-group-text bg-white" htmlFor='search' >
                      <FontAwesomeIcon icon={faSearch} />
                    </label>
                    <input
                      type="search"
                      className="form-control form-control"
                      name='search'
                      id='search'
                      autoComplete="off"
                      placeholder="Find by title"
                      defaultValue={keywords}
                    />
                  </form>
                </div>

                <div className="my-2 border rounded rounded-sm" style={{ height: '60vh', overflowY: 'scroll' }}>
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

            <div className="col-12 col-md-6 col-xxl-4 rounded rounded-sm p-3 bg-light">
              <Editor
                reset={resetSearch}
                changeToCreateMode={handleMiniTestDrop}
                miniTestInit={editorState === EDITOR_STATE.UPDATE && miniTestEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  MiniTests
}
