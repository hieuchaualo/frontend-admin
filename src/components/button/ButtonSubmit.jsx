import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import Spinner from 'react-bootstrap/Spinner'
import { BUTTON_STATE } from "../../utils";

function ButtonSubmit({
    buttonState,
    resetState,
    title,
    onClick,
    className = 'btn-primary fw-bold px-5',
    classNameRejected = 'btn-danger fw-bold px-5'
}) {

    if (buttonState === BUTTON_STATE.DISABLE) return (
        <button
            className={'btn ' + className}
            type='submit'
            disabled
        >
            {title}
        </button>
    )

    if (buttonState === BUTTON_STATE.ENABLE) return (
        <button
            className={'btn ' + className}
            type='submit'
            onClick={onClick}
        >
            {title}
        </button>
    )

    if (buttonState === BUTTON_STATE.PENDING) return (
        <button
            className={'btn ' + className}
            type='submit'
            disabled
        >
            <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            /> { } Pending...
        </button>
    )

    if (buttonState === BUTTON_STATE.DONE) return (
        <button
            className={'btn ' + className}
            type='button'
            onClick={resetState}
        >
            <FontAwesomeIcon icon={faCheckCircle} /> { } Done
        </button>
    )

    if (buttonState === BUTTON_STATE.REJECTED) return (
        <button
            className={'btn ' + classNameRejected}
            type='button'
            onClick={resetState}
        >
            <FontAwesomeIcon icon={faExclamationCircle} /> { } Rejected
        </button>
    )

    return (
        <button
            className={'btn ' + className}
            type='submit'
            disabled
        >
            {title}
        </button>
    )
}

export { ButtonSubmit }