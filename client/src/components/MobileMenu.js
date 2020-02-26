import React from "react";

const MobileMenu = ({
  setShowMobileMenu,
  handleShowDashboard,
  handleShowMyWords,
  handleShowMyTexts
}) => {
  return (
    <div className="mobile-menu">
      <span
        className="mobile-menu__close-button"
        onClick={() => setShowMobileMenu(false)}
      >
        &times;
      </span>

      <div className="mobile-menu__links">
        <div
          className="mobile-menu__dashboard-button"
          onClick={handleShowDashboard}
        >
          Dashboard
        </div>
        <div
          className="mobile-menu__my-words-button"
          onClick={handleShowMyWords}
        >
          My Words
        </div>
        <div
          className="mobile-menu__my-texts-button"
          onClick={handleShowMyTexts}
        >
          My Texts
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
