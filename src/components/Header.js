import React from "react";

const Header = ({ handleShowDashboard }) => {
  return (
    <div className="header__wrapper">
      <button onClick={handleShowDashboard}>Dashboard</button>
      <button>My Vocab</button>
      <button>My Account</button>
    </div>
  );
};

export default Header;
