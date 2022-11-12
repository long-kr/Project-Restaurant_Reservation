import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";
import "./Layout.css";
import Header from "./Header";

/**
 * Defines the main layout of the application.
 *
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fuild h-100">
      <div className="row h-100">
        <div id="sidebarMenu" className="collapse d-lg-block sidebar collapse col-sm">
          <Menu />
        </div>
        <div className="col">
          <div>
            <Header />
          </div>
          <div style={{ marginTop: 110 }} className="main-background ">
            <Routes />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
