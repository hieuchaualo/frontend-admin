import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks";
import { useAccount } from "../../contexts";
import { loginAccount } from "../../api";
import { EmailField, NameField, PasswordField } from "../../components";
import { ROUTERS_PATH, toNavigatePath } from "../../routers/MainRoutes";
import { ACCOUNT_ROLES, BUTTON_STATE, toImgUrl } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Editor } from "./components";
const miniTestsList = {
  "data": [
    {
      "_id": "64b37f91308737100a052d57",
      "title": "Wood: a valuable resource in New Zealand’s economy",
      "creator": {
        "_id": "64b582de3930e92a102bcf16",
        "name": "administrator"
      },
      "thumbnail": "reading-test-thumbnails/1689006467359-858.png"
    },
    {
      "_id": "64b37f91308737100a052d58",
      "title": "Wood: a valuable resource in New Zealand’s economy",
      "creator": {
        "_id": "64b582de3930e92a102bcf16",
        "name": "administrator"
      },
      "thumbnail": "reading-test-thumbnails/1689006467359-858.png"
    },
    {
      "_id": "64b37f91308437100a052d58",
      "title": "Wood: a valuable resource in New Zealand’s economy",
      "creator": {
        "_id": "64b582de3930e92a102bcf16",
        "name": "administrator"
      },
      "thumbnail": "reading-test-thumbnails/1689006467359-858.png"
    },
    {
      "_id": "64b37f91308737105a052d58",
      "title": "Wood: a valuable resource in New Zealand’s economy",
      "creator": {
        "_id": "64b582de3930e92a102bcf16",
        "name": "administrator"
      },
      "thumbnail": "reading-test-thumbnails/1689006467359-858.png"
    },
    {
      "_id": "64b37f98308737100a052d58",
      "title": "Wood: a valuable resource in New Zealand’s economy",
      "creator": {
        "_id": "64b582de3930e92a102bcf16",
        "name": "administrator"
      },
      "thumbnail": "reading-test-thumbnails/1689006467359-858.png"
    }
  ],
  "limit": 12,
  "currentPage": 1,
  "totalPages": 1
}

const errorMessage = 'You have entered an invalid username or password!'

const MiniTests = ({ pageTitle }) => {
  usePageTitle(pageTitle);
  const navigate = useNavigate();
  const location = useLocation();
  const accountContext = useAccount();
  const [keywords, setKeywords] = useState('')
  const [buttonState, setButtonState] = useState(BUTTON_STATE.ENABLE);

  // all value must true to submit form
  const validationObject = useRef({
    email: false,
    password: false,
  });

  const handleValidate = (key, value) => {
    validationObject.current[key] = value;
  };

  const handleLogin = async formBody => {
    try {
      setButtonState(BUTTON_STATE.PENDING);
      const response = await loginAccount(formBody);
      if (response.data?.token && response.data?.account?.roles.includes(ACCOUNT_ROLES.ADMIN)) {
        localStorage.setItem('jwt_token', response.data.token);
        accountContext.init(response.data.account);
        setButtonState(BUTTON_STATE.SUCCESS);
        navigate(toNavigatePath(ROUTERS_PATH.home));
      } else {
        setButtonState(BUTTON_STATE.ERROR);
      }
    } catch (error) {
      console.error(error)
      setButtonState(BUTTON_STATE.ERROR);
    }
  };

  const handleOnSubmit = event => {
    event.preventDefault();
    // check the isValid Object is NOT has any fields not valid
    if (!Object.values(validationObject.current).includes(false)) {
      const { currentTarget } = event;
      const formBody = {
        email: currentTarget.email.value,
        password: currentTarget.password.value,
      };
      handleLogin(formBody);
    }
  };

  const handleOnSearch = event => {
    event.preventDefault()
    const value = document.getElementById('search').value.trim()
    if (value) {
      setKeywords(value)
      if (ROUTERS_PATH.search !== location.pathname.substring(1)) navigate(ROUTERS_PATH.search)
    }
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
                    <label className="input-group-text bg-white" htmlFor='search'>
                      <FontAwesomeIcon icon={faSearch} />
                    </label>
                    <input
                      type="search"
                      className="form-control form-control"
                      name='search'
                      id='search'
                      autoComplete="off"
                      placeholder="Find by id, title, or creator id"
                      defaultValue={keywords}
                    />
                  </form>
                </div>
                <div className="my-2 border rounded rounded-sm" style={{ height: '50vh', overflowY: 'scroll' }}>
                  {miniTestsList.data.map(miniTestList => (
                    <div key={miniTestList._id} className="row m-2 bg-white rounded rounded-sm shadow-hover cursor-pointer">
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
              <Editor />
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
