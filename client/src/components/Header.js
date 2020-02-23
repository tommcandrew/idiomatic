import React from "react";

const Header = ({
  handleShowDashboard,
  handleShowMyTexts,
  handleShowMyWords
}) => {
  return (
    <div className="header__wrapper">
      <button onClick={handleShowDashboard}>Dashboard</button>
      <button onClick={handleShowMyWords}>My Words</button>
      <button onClick={handleShowMyTexts}>My Texts</button>
      <button>My Account</button>
    </div>
  );
};

export default Header;
