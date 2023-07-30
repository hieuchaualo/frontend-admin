import { useState } from "react";
import { isValidEmail } from "../../../utils";

const EmailField = ({
  handleValidate,
  defaultValue = '',
  placeholder = 'Enter your email',
  invalidMessage = `Invalid email address. Valid e-mail can contain only latin letters, numbers, '@' and '.'`,
  fieldName = 'email',
  fieldLabel = 'Email',
  isRequired = true,
  isDisabled = false,
  isAutoFocus = false,
}) => {
  const [invalidEmailMessage, setInvalidEmailMessage] = useState("");
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleOnChange = event => {
    const eventTargetValue = event.target.value.trim()?.toLowerCase();
    setInputValue(eventTargetValue);
    if (isValidEmail(eventTargetValue)) {
      setInvalidEmailMessage("");
      handleValidate(fieldName, true);
    } else {
      setInvalidEmailMessage(invalidMessage);
      handleValidate(fieldName, false);
    }
  };

  return (
    <div className="form-group my-2">
      <label htmlFor={fieldName}>
        {fieldLabel} {isRequired && <span className="text-danger">*</span>}
      </label>
      <input
        name={fieldName}
        type="email"
        className={`form-control my-1 ${invalidEmailMessage && "is-invalid"}`}
        placeholder={placeholder}
        autoComplete="off"
        value={inputValue}
        onChange={handleOnChange}
        onBlur={handleOnChange}
        disabled={isDisabled}
        required={isRequired}
        autoFocus={isAutoFocus}
      />
      <small className="text-danger">
        {invalidEmailMessage}
      </small>
    </div>
  );
};

export {
  EmailField,
};
