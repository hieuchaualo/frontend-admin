import { useState } from "react";
import { isValidPassword } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PasswordField = ({
  handleValidate,
  defaultValue = '',
  placeholder = 'Enter your password',
  invalidMessage = 'Your password must be at least 8 characters including a special character, and a number',
  fieldName = 'password',
  fieldLabel = 'Password',
  isRequired = true,
  isDisabled = false,
  isAutofocus = false,
  defaultIsShowPassword = false,
}) => {
  const [invalidMessagePassword, setInvalidPasswordMessage] = useState("");
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isShowPassword, setIsShowPassword] = useState(defaultIsShowPassword);

  const toggleIsShowPassword = () => setIsShowPassword(!isShowPassword)

  const handleOnChange = event => {
    const eventTargetValue = event.target.value;
    setInputValue(eventTargetValue);
    if (isValidPassword(eventTargetValue)) {
      setInvalidPasswordMessage("");
      handleValidate(fieldName, true);
    } else {
      setInvalidPasswordMessage(invalidMessage);
      handleValidate(fieldName, false);
    }
  };

  return (
    <div className="form-group my-2">
      <label htmlFor={fieldName}>
        {fieldLabel} {isRequired && <span className="text-danger">*</span>}
      </label>
      <div className="input-group">
        <input
          name={fieldName}
          type={isShowPassword ? 'text' : 'password'}
          className={`form-control my-1 ${invalidMessagePassword && "is-invalid"}`}
          placeholder={placeholder}
          autoComplete="off"
          value={inputValue}
          onChange={handleOnChange}
          onBlur={handleOnChange}
          required={isRequired}
          disabled={isDisabled}
          autoFocus={isAutofocus}
        />
        <span className="input-group-text my-1" onClick={toggleIsShowPassword}>
          <FontAwesomeIcon icon={isShowPassword ? faEye : faEyeSlash} />
        </span>
      </div>
      <small className="text-danger">
        {invalidMessagePassword}
      </small>
    </div>
  );
};

export {
  PasswordField,
};

