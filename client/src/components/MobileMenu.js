import React from "react";

const MobileMenu = ({ showMobileMenu, setShowMobileMenu, setCurrentComponent }) => {
  return (
    <div className={`mobile-menu ${showMobileMenu ? 'mobile-menu__show' : 'mobile-menu__hide'}`}>
      <span
        className="mobile-menu__close-button"
        onClick={() => setShowMobileMenu(false)}
      >
        &times;
      </span>

      <div className="mobile-menu__links">
        <div
          className="mobile-menu__dashboard-button"
          onClick={() => {
            setCurrentComponent("Dashboard");
            setShowMobileMenu(false);
          }}
        >
          Dashboard
        </div>
        <div
          className="mobile-menu__my-words-button"
          onClick={() => {
            setCurrentComponent("MyWords");
            setShowMobileMenu(false);
          }}
        >
          My Words
        </div>
        <div
          className="mobile-menu__my-texts-button"
          onClick={() => {
            setCurrentComponent("MyTexts");
            setShowMobileMenu(false);
          }}
        >
          My Texts
        </div>
        <div
          className="mobile-menu__my-account-button"
          onClick={() => {
            setCurrentComponent("MyAccount");
            setShowMobileMenu(false);
          }}
        >
          My Account
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
