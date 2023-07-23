import React, { useEffect, useState } from 'react'
import { updateAccount } from '../../../api'
import { useAccount } from '../../../contexts'


function AccountName() {
    const accountContext = useAccount()
    const [editNameElement, setEditNameElement] = useState(false)
    const [accountName, setAccountName] = useState('')
    const [newName, setNewName] = useState('')

    useEffect(() => {
        setAccountName(accountContext.name)
        setNewName(accountContext.name)
    }, [accountContext.name])

    const handleNameSubmit = async event => {
        try {
            event.preventDefault()
            await updateAccount({
                _id: accountContext._id,
                name: newName,
            })
            setAccountName(newName)
            hideEditNameElement()
        } catch (error) {
            console.error(error)
        }
    }

    const handleNameChange = event => {
        setNewName(event.target.value)
    }

    const showEditNameElement = () => {
        setEditNameElement(true)
    }

    const hideEditNameElement = () => {
        setEditNameElement(false)
    }

    return (
        <div onClick={showEditNameElement} style={{ height: '70px' }}>
            <label
                className={editNameElement ? 'd-none' : 'd-block'}
                htmlFor="accountName">
                <span className='fw-bold cursor-text fs-3'>
                    {accountName}
                </span>
            </label>
            <form onSubmit={handleNameSubmit}>
                <input
                    type='text'
                    name='accountName'
                    id='accountName'
                    maxLength='32'
                    minLength='2'
                    autoComplete="off"
                    className='input-transparent p-0 fs-3 fw-bold text-center w-100'
                    onBlur={hideEditNameElement}
                    onChange={handleNameChange}
                    value={newName}
                    required
                    hidden={!editNameElement}
                />
            </form>
            <small className='text-danger'>
                {(newName !== accountName) && <span>
                    Submit form or <u className='cursor-pointer' onClick={handleNameSubmit}>click here</u> to save changes.
                </span>}
            </small>
        </div>
    )
}

export default AccountName