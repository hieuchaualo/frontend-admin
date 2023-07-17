import { useState, createContext, useContext, useMemo, useEffect } from 'react'
import { isHasAccessToken } from '../utils'
import { getAccount } from '../api'

const AccountContext = createContext({ _id: '', name: '', email: '', roles: [], init: () => { } })

function AccountProvider({ children }) {
  const init = accountInit => {
    setAccount({ ...account, ...accountInit })
  }

  const [account, setAccount] = useState({
    _id: '', name: '', email: '', roles: [], init
  })

  const getAccountAlreadyLogin = async () => {
    const response = await getAccount()
    if (response.data.roles.includes('admin')) init(response.data)
  }

  useEffect(() => {
    if (isHasAccessToken()) getAccountAlreadyLogin()
    return () => setAccount({ _id: '', name: '', email: '', roles: [], init: () => { } })
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
