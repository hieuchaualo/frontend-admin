import { useState } from "react";
import { isValidMinMax, removeSpecialCharacter } from "../../../utils";

const NameField = ({
  handleValidate,
  defaultValue = '',
  placeholder = 'Enter your name',
  invalidMessage = 'Your name must be at least 2 characters and not longer 32 characters',
  fieldName = 'name',
  fieldLabel = 'Name',
  isRequired = true,
  isDisabled = false,
  isAutofocus = false,
}) => {
  const [invalidNameMessage, setInvalidNameMessage] = useState("");
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleOnChange = event => {
    const eventTargetValue = event.target.value;
    const valueCleaned = removeSpecialCharacter(eventTargetValue);
    setInputValue(valueCleaned);
    if (isValidMinMax(valueCleaned.length, 2, 32)) {
      setInvalidNameMessage("");
      handleValidate(fieldName, true);
    } else {
      setInvalidNameMessage(invalidMessage);
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
        type="text"
        className={`form-control my-1 ${invalidNameMessage && "is-invalid"}`}
        placeholder={placeholder}
        autoComplete="off"
        value={inputValue}
        onChange={handleOnChange}
        onBlur={handleOnChange}
        required={isRequired}
        disabled={isDisabled}
        autoFocus={isAutofocus}
      />
      <small className="text-danger">
        {invalidNameMessage}
      </small>
    </div>
  );
};

export {
  NameField,
};
