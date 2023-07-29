import React, { useContext, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { GlobalContext } from "../utils/GlobalContext";

const Topnav = () => {
  const { showSidebar, setShowSidebar } = useContext(GlobalContext);
  useEffect(() => {
    handleSidebar();
  }, [showSidebar]);
  const handleSidebar = () => {
    const sidebar = document.getElementsByClassName("app_sidebar")[0];
    showSidebar ? (sidebar.style.opacity = "1") : (sidebar.style.opacity = "0");
  };
  return (
    <div className="topnav_header">
      <MenuIcon
        className="desktop-hidden"
        onClick={() => setShowSidebar(!showSidebar)}
      />
      <p className="topnav_heading">Dijkstra Path Finder</p>
    </div>
  );
};

export default Topnav;
