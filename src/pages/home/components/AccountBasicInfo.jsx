import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { updateAccountAvatar } from '../../../api'
import { toImgUrl } from '../../../utils'
import AccountName from './AccountName'
import { useAccount } from '../../../contexts'
import { AccountUpdate } from './AccountUpdate'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'


function AccountBasicInfo() {
    const accountContext = useAccount()
    const [isEditingAvatar, setIsEditingAvatar] = useState(false)
    const [avatar, setAvatar] = useState(undefined)

    const handleUpdate = async event => {
        const picture = event.target.files[0]
        if (picture) {
            try {
                const formData = new FormData()
                formData.append('_id', accountContext._id)
                formData.append('file', picture)
                const response = await updateAccountAvatar(formData)
                setAvatar(response.data.data)
                document.getElementById('picture').value = null
            } catch (error) {
                console.error(error)
            }
        } else {
            document.getElementById('picture').value = null
            window.scroll(0, document.getElementById('picture'))
        }
    }

    return (
        <>
            <div className='col' >
                <form onSubmit={event => event.preventDefault()}>
                    <div
                        className='col bg-warning rounded rounded-1 bg-warning'
                        onMouseEnter={() => setIsEditingAvatar(true)}
                        style={{
                            position: 'inherit',
                            left: 0,
                            right: 0,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            height: '100px',
                            width: '100px',
                        }}>
                        <img
                            src={avatar || (accountContext.thumbnail ? toImgUrl(accountContext.thumbnail) : "/images/logo192.png")}
                            className="rounded rounded-1 h-100 w-100"
                            style={{ objectFit: 'cover', position: 'relative' }}
                            alt='avatar'
                        />

                        <label
                            htmlFor="picture"
                            className="rounded rounded-1"
                            onMouseLeave={() => setIsEditingAvatar(false)}
                            style={{
                                position: 'relative',
                                top: '-100px',
                                left: '0px',
                                opacity: isEditingAvatar ? 1 : 0,
                                height: '100px',
                                width: '100px',
                                backdropFilter: "blur(4px) brightness(50%)",
                                transition: 'opacity 0.2s linear',
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faImage}
                                className='text-light'
                                style={{
                                    position: 'relative',
                                    height: 32,
                                    width: 34,
                                    top: 34,
                                }}
                            />
                        </label>
                        <input
                            className="rounded-3"
                            type='file'
                            name='picture'
                            id='picture'
                            onChange={handleUpdate}
                            hidden
                            accept='image/png, image/jpg, image/jpeg'
                        />
                    </div>
                </form >
            </div>
            <div className='col p-3' style={{ minHeight: '100px', position: 'relative' }}>
                <AccountName />
                <div>
                    Roles: {accountContext.roles.map(role => <u key={role} className='text-capitalize'>{role} </u>)}
                </div>
                <div className='text-start'>
                    <AccountUpdate />
                    <div
                        onClick={() => accountContext.logout()}
                        className="btn btn-outline-secondary w-100 mt-2 mb-1 px-sm-4"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountBasicInfo