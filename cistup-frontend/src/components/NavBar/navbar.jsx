import React from "react";
import "./navbar.css";

const NavBar = () => {
  return (
    <nav>
      <div className="navbar-logo">
        <img
          src="https://cistup.iisc.ac.in/CiSTUP_Website/img/logo.png"
          alt="Logo"
        />
      </div>
      <div className="navbar-title">
        Centre for infrastructure, Sustainable Transportation and Urban Planning
         Indian Institute of Science (IISc), Bangalore
      </div>
      <div className="navbar-links"></div>
    </nav>
  );
};

export default NavBar;
