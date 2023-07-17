import 'bootstrap/dist/css/bootstrap.min.css'
import 'cooltipz-css';
import './App.scss'
import { AccountProvider } from './contexts'
import { BrowserRouter } from 'react-router-dom'
import { MainRoutes } from './routers'

function App() {
  return (
    <AccountProvider>
      <BrowserRouter>
        <MainRoutes />
      </BrowserRouter>
    </AccountProvider>
  );
}

export default App;

