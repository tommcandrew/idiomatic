import React from "react";

const OptionsMenu = ({
  handleShowMyProfile,
  logout,
  setMouseOverOptionsMenu
}) => {
  return (
    <div
      className="header__options-menu"
      onMouseEnter={() => setMouseOverOptionsMenu(true)}
      onMouseLeave={() => setMouseOverOptionsMenu(false)}
    >
      <ul>
        <li>Settings</li>
        <li onClick={handleShowMyProfile}>Profile</li>
      </ul>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default OptionsMenu;
