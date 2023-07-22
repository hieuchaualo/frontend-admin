import { useState, createContext, useContext, useMemo, useEffect } from 'react'
import { ACCOUNT_ROLES, isHasAccessToken } from '../utils'
import { getAccount } from '../api'
import { useNavigate } from 'react-router-dom';
import { ROUTERS_PATH, toNavigatePath } from '../routers';

const AccountContext = createContext({ _id: '', name: '', email: '', roles: [], init: () => { }, logout: () => { } })

function AccountProvider({ children }) {
  const navigate = useNavigate();

  const init = (_account, _token) => {
    if (_token) localStorage.setItem('jwt_token', _token);
    setAccount({ ...account, ..._account })
  }

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setAccount({ ...account, _id: '', name: '', email: '', roles: [] })
    navigate(toNavigatePath(ROUTERS_PATH.login))
  }

  const [account, setAccount] = useState({
    _id: '', name: '', email: '', roles: [], init, logout,
  })

  const getAccountAlreadyLogin = async () => {
    const response = await getAccount()
    const responseData = response.data.data
    if (response.status === 200 && responseData.roles.includes(ACCOUNT_ROLES.ADMIN)) init(responseData)
    else navigate(toNavigatePath(ROUTERS_PATH.login));
  }

  useEffect(() => {
    if (isHasAccessToken()) getAccountAlreadyLogin()
    return () => navigate(toNavigatePath(ROUTERS_PATH.login))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const accountState = useMemo(() => (account), [account])

  return (
    <AccountContext.Provider value={accountState}>
      {children}
    </AccountContext.Provider>
  )
}

function useAccount() {
  return useContext(AccountContext)
}

export {
  AccountProvider,
  useAccount,
}
