import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './Header';
import './Layout.css';
import Menu from './Menu';

/**
 * Defines the main layout of the application.
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fuild h-100">
      <div className="row h-100">
        <Menu />

        <Header />

        <div className="main-background col">
          <Outlet />
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default Layout;
