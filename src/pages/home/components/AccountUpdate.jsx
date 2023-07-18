import { useRef, useState } from "react";
import { BUTTON_STATE } from "../../../utils";
import { updateAccountName } from "../../../api";
import { PasswordField } from "../../../components";

const AccountUpdate = () => {
    const [updateAccountState, setUpdateAccountState] = useState(BUTTON_STATE.ENABLE);

    // all value must true to submit form
    const validationObject = useRef({
        password: false,
    });

    const handleValidate = (key, value) => {
        validationObject.current[key] = value;
    };

    const handleUpdateAccount = async formBody => {
        try {
            setUpdateAccountState(BUTTON_STATE.PENDING);
            const response = await updateAccountName(formBody);
            setUpdateAccountState(BUTTON_STATE.SUCCESS);
        } catch (error) {
            console.error(error)
            setUpdateAccountState(BUTTON_STATE.ERROR);
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
            handleUpdateAccount(formBody);
        }
    };

    return (
        <form onSubmit={handleOnSubmit}>
            <PasswordField
                placeholder="Enter your new password"
                isDisabled={(updateAccountState === BUTTON_STATE.PENDING)}
                handleValidate={handleValidate}
            />
            <button
                type="submit"
                className="btn btn-orange text-white w-100 mt-2 mb-1 px-sm-4"
                disabled={updateAccountState === BUTTON_STATE.PENDING}
            >
                Update password
            </button>
            <small className="text-danger mb-2">
                {(updateAccountState === BUTTON_STATE.ERROR) && <>
                    <strong>Error:</strong> An error when updating account
                </>}
            </small>
        </form>
    )
}

export {
    AccountUpdate
}