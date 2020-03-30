import React, { useContext, useState } from "react";
import DeviceContext from "../context/DeviceContext";
import AuthContext from "../context/AuthContext";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import OptionsMenu from "./OptionsMenu";

const Header = ({ showMobileMenu, setShowMobileMenu, setCurrentComponent }) => {
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
          setCurrentComponent={setCurrentComponent}
        />
      )}
      {device === "desktop" && (
        <>
          <div className="header__buttons--left">
            <button onClick={() => setCurrentComponent("Dashboard")}>
              Dashboard
            </button>
            <button onClick={() => setCurrentComponent("Texts")}>
              Choose Text
            </button>
            <button onClick={() => setCurrentComponent("UploadText")}>
              Upload Text
            </button>
            <button onClick={() => setCurrentComponent("MyWords")}>
              My Words
            </button>
            <button onClick={() => setCurrentComponent("MyTexts")}>
              My Texts
            </button>
          </div>
          <div className="header__buttons--right">
            <FontAwesomeIcon
              icon={faUserCircle}
              onMouseEnter={() => setMouseOverIcon(true)}
              onMouseLeave={() => setMouseOverIcon(false)}
              className="header__user-icon"
            />
            {mouseOverIcon || mouseOverOptionsMenu ? (
              <OptionsMenu
                logout={logout}
                setCurrentComponent={setCurrentComponent}
                setMouseOverOptionsMenu={setMouseOverOptionsMenu}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
