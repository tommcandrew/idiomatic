import React from "react";

const OptionsMenu = ({
  logout,
  setCurrentComponent,
  setMouseOverOptionsMenu,
}) => {
  return (
    <div
      className="header__options-menu"
      onMouseEnter={() => setMouseOverOptionsMenu(true)}
      onMouseLeave={() => setMouseOverOptionsMenu(false)}
    >
      <ul>
        <li>Settings</li>
        <li onClick={() => setCurrentComponent("MyAccount")}>Account</li>
      </ul>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default OptionsMenu;
