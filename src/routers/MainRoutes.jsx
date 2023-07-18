import { Routes, Route, Navigate } from "react-router-dom"
import {
  Error404,
  Error500,
  Error503,
  Home,
  Login,
} from "../pages"

const ROUTERS_PATH = {
  login: 'login/',
  home: 'home/',
  accounts: 'accounts/',
  miniTests: 'mini-tests/',
  speedTests: 'speed-tests/',
  readingTips: 'reading-tips/',
}

const toNavigatePath = routerPath => '/' + routerPath.substring(0, routerPath.length - 1)

const MainRoutes = () => {

  return (
    <>
      <div style={{ minHeight: '100vh' }} className="bg-light">
        <Routes >
          <Route path="/">
            <Route index element={<Home pageTitle="Home" />} />
            <Route path={ROUTERS_PATH.home} element={<Navigate to="/" replace />} />

            {/* Account */}
            < Route path={ROUTERS_PATH.login} element={<Login pageTitle="Login" />} />

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
