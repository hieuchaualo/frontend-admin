import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../../hooks";
import { useAccount } from "../../contexts";
import { loginAccount } from "../../api";
import { EmailField, PasswordField } from "../../components";

const LOGIN_STATE = {
  NONE: "NONE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  ERROR: "ERROR",
}

const errorMessage = 'You have entered an invalid username or password'

const Login = ({ pageTitle }) => {
  usePageTitle(pageTitle);
  const navigate = useNavigate();
  const accountContext = useAccount();
  const [loginState, setLoginState] = useState(LOGIN_STATE.NONE);

  useEffect(() => {
    console.log(accountContext._id)
    if (accountContext._id) navigate('/account');
  }, [accountContext._id, navigate]);

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
      console.log(response)
      if (response.data?.token) {
        localStorage.setItem('jwt_token', response.data.token);
        accountContext.init(response.data.account);
        setLoginState(LOGIN_STATE.SUCCESS);
        navigate("/home");
      } else {
        setLoginState(LOGIN_STATE.ERROR);
      }
    } catch (error) {
      console.error(error)
      setLoginState(LOGIN_STATE.ERROR);
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
    } else {
      console.log('not valid')
    }
  };

  return (
    <div className="container">
      <div className="row m-0 p-2 p-sm-3 p-md-1">
        <div className="col text-center p-0 me-0 me-md-2 mb-2 mb-md-0">
          <div className="rounded-circle-1 bg-white py-3">
            <h1 className="h1">
              <strong>
                {/* app name */}
              </strong>
            </h1>
            <div className="row mx-0 p-3">
              <img src="./images/login.png" className="img-fluid" alt="Logo" />
            </div>
            <h2 className="h2 text-orange fs-3">
              <strong>
                Increase Your Reading Skill
              </strong>
            </h2>
            <p className="fs-6">
              Embark on an English journey of mastery
              <br />
              with our immersive reading app!
            </p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xxl-4 p-3 rounded-circle-1 bg-white">
          <div className="row text-center">
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
              className="btn btn-orange text-white w-100 mb-4 mt-sm-3 px-sm-4"
              disabled={loginState === LOGIN_STATE.PENDING}
            >
              Login as administrator
            </button>
            {(loginState === LOGIN_STATE.FAILED) && errorMessage}
          </form>
        </div>
      </div>
    </div>
  );
};

export {
  Login
}
