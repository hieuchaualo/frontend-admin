import { Routes, Route, Navigate } from "react-router-dom"
import {
  Error404,
  Error500,
  Error503,
  Home,
  Login,
  MiniTests,
  Account,
  ReadingTip,
} from "../pages"

const ROUTERS_PATH = {
  login: 'login/',
  home: 'home/',
  accounts: 'accounts/',
  miniTests: 'mini-tests/',
  readingTips: 'reading-tips/',
}

const toNavigatePath = routerPath => '/' + routerPath.substring(0, routerPath.length - 1)

const MainRoutes = () => {

  return (
    <>
      <div style={{ minHeight: '100vh' }} className="bg-light">
        <Routes >
          <Route path="/">
            <Route index element={<Login pageTitle="Login" />} />
            <Route path={ROUTERS_PATH.login} element={<Navigate to="/" replace />} />

            {/* Account */}
            <Route path={ROUTERS_PATH.home} element={<Home pageTitle="Home" />} />

            {/* System management */}
            <Route path={ROUTERS_PATH.accounts} element={<Account pageTitle={'Accounts'} />} />
            <Route path={ROUTERS_PATH.miniTests} element={<MiniTests pageTitle={'Mini tests'} />} />
            <Route path={ROUTERS_PATH.readingTips} element={<ReadingTip pageTitle={'Mini tests'} />} />

            {/* Error */}
            <Route path="*" element={<Error404 pageTitle="Not found" />} />
            <Route path={ROUTERS_PATH.error500} element={<Error500 pageTitle="Internal server error" />} />
            <Route path={ROUTERS_PATH.error503} element={<Error503 pageTitle="Service temporarily unavailable" />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export { MainRoutes, ROUTERS_PATH, toNavigatePath }
