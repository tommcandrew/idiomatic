import React, { useContext, useState } from "react";
import DeviceContext from "../context/DeviceContext";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../context/AuthContext";

const Header = ({
  handleShowDashboard,
  handleShowMyTexts,
  handleShowMyWords,
  handleShowTexts,
  handleShowMyProfile,
  showMobileMenu,
  setShowMobileMenu
}) => {
  const { device } = useContext(DeviceContext);
  const { logout } = useContext(AuthContext);
  const [mouseOverIcon, setMouseOverIcon] = useState(false);
  const [mouseOverOptionsMenu, setMouseOverOptionsMenu] = useState(false);

  return (
    <div className="header__wrapper">
      {device !== "desktop" && (
        <div
          className="header__hamburger"
          onClick={() => setShowMobileMenu(true)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {showMobileMenu && (
        <MobileMenu
          setShowMobileMenu={setShowMobileMenu}
          handleShowDashboard={handleShowDashboard}
          handleShowMyWords={handleShowMyWords}
          handleShowMyTexts={handleShowMyTexts}
        />
      )}
      {device === "desktop" && (
        <>
          <div className="header__buttons--left">
            <button onClick={handleShowDashboard}>Dashboard</button>
            <button onClick={handleShowMyWords}>My Words</button>
            <button onClick={handleShowMyTexts}>My Texts</button>
            <button onClick={handleShowTexts}>Choose Text</button>
          </div>
          <div className="header__buttons--right">
            <FontAwesomeIcon
              icon={faUserCircle}
              onMouseEnter={() => setMouseOverIcon(true)}
              onMouseLeave={() => setMouseOverIcon(false)}
              className="header__user-icon"
            />
            {mouseOverIcon || mouseOverOptionsMenu ? (
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
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
