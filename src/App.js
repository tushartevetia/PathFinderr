import React from "react";
import Sidenav from "./components/Sidenav";
import Topnav from "./components/Topnav";
import Board from "./components/Board";
import "./styles/_app.scss";
import GlobalContext from "./utils/GlobalContext.js";
import { GlobalContextProvider } from "./utils/GlobalContext.js";

const App = () => {
  return (
    <GlobalContextProvider>
      <div className="app_layout">
        <div className="app_sidebar">
          <Sidenav />
        </div>
        <div className="app_body">
          <div className="app_topbar">
            <Topnav />
          </div>
          <div className="app_content">
            <Board />
          </div>
        </div>
      </div>
    </GlobalContextProvider>
  );
};

export default App;
