import React, { useContext, useState } from "react";
import DeviceContext from "../context/DeviceContext";
import MobileMenu from "./MobileMenu";

const Header = ({
  handleShowDashboard,
  handleShowMyTexts,
  handleShowMyWords,
  handleShowTexts
}) => {
  const { device } = useContext(DeviceContext);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="header__wrapper">
      {device !== "desktop" && (
        <div className="header__hamburger" onClick={() => setShowMenu(true)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {showMenu && <MobileMenu setShowMenu={setShowMenu} />}
      {device === "desktop" && (
        <>
          <div className="header__buttons--left">
            <button onClick={handleShowDashboard}>Dashboard</button>
            <button onClick={handleShowMyWords}>My Words</button>
            <button onClick={handleShowMyTexts}>My Texts</button>
            <button onClick={handleShowTexts}>Choose Text</button>
          </div>
          <div className="header__buttons--right">
            <button>My Account</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
