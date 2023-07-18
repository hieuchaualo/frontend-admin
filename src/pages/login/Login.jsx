import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks";
import { useAccount } from "../../contexts";
import { loginAccount } from "../../api";
import { EmailField, PasswordField } from "../../components";
import { ROUTERS_PATH, toNavigatePath } from "../../routers/MainRoutes";
import { ACCOUNT_ROLES } from "../../utils";

const LOGIN_STATE = {
  NONE: "NONE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
}

const errorMessage = 'You have entered an invalid username or password!'

const Login = ({ pageTitle }) => {
  usePageTitle(pageTitle);
  const navigate = useNavigate();
  const accountContext = useAccount();
  const [loginState, setLoginState] = useState(LOGIN_STATE.NONE);

  useEffect(() => {
    if (accountContext._id && (accountContext.roles.includes(ACCOUNT_ROLES.ADMIN))) navigate(toNavigatePath(ROUTERS_PATH.home));
  }, [accountContext._id, accountContext.roles, navigate]);

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
      setLoginState(LOGIN_STATE.PENDING);
      const response = await loginAccount(formBody);
      if (response.data?.token && response.data?.account?.roles.includes(ACCOUNT_ROLES.ADMIN)) {
        localStorage.setItem('jwt_token', response.data.token);
        accountContext.init(response.data.account);
        setLoginState(LOGIN_STATE.SUCCESS);
        navigate(toNavigatePath(ROUTERS_PATH.home));
      } else {
        setLoginState(LOGIN_STATE.FAILED);
      }
    } catch (error) {
      console.error(error)
      setLoginState(LOGIN_STATE.FAILED);
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

  return (
    <div style={{ background: 'url("/images/background.jpg")', backgroundSize: 'auto 100vh', minHeight: '100vh' }}>
      <div style={{ backdropFilter: 'blur(10px)', minHeight: '100vh' }}>
        <div className="container py-5">
          <div className="row m-0 p-2 p-sm-3 p-md-1">
            <div className="col text-center p-0 me-0 me-md-2 mb-2 mb-md-0">
              <div className="rounded rounded-sm py-3" style={{ background: '#FFF9' }}>
                <h1 className="h1">
                  <strong>
                    {/* app name */}
                  </strong>
                </h1>
                <div className="row mx-0 p-3">
                  <img
                  src="/images/logo.png"
                  className="img-fluid rounded-circle"
                  alt="SUDOSUDOES Reading Master Logo"
                  style={{ filter: 'hue-rotate(150deg) saturate(40%) brightness(150%)' }}
                  draggable={false}
                />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xxl-4 rounded rounded-sm py-3 bg-white">
              <div className="row text-center text-orange">
                <h2><strong>System management</strong></h2>
              </div>
              <form onSubmit={handleOnSubmit}>
                <EmailField
                  isDisabled={(loginState === LOGIN_STATE.PENDING)}
                  handleValidate={handleValidate}
                />
                <PasswordField
                  isDisabled={(loginState === LOGIN_STATE.PENDING)}
                  handleValidate={handleValidate}
                />
                <button
                  type="submit"
                  className="btn btn-orange text-white w-100 mt-2 mb-1 px-sm-4"
                  disabled={loginState === LOGIN_STATE.PENDING}
                >
                  Login as administrator
                </button>
                <small className="text-danger mb-2">
                  {(loginState === LOGIN_STATE.FAILED) && <>
                    <strong>Error:</strong> {errorMessage}
                  </>}
                </small>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  Login
}
