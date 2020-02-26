import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const MyAccount = () => {
  const { userEmail, userName, registerDate, deleteAccount } = useContext(
    AuthContext
  );

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      deleteAccount();
    } else {
      return;
    }
  };
  return (
    <div className="myProfile__wrapper">
      <h1 className="myProfile__title">MY ACCOUNT</h1>
      <ul className="myProfile__list">
        <li>Name: {userName}</li>
        <li>Email: {userEmail}</li>
        <li>Member since: {registerDate}</li>
      </ul>
      <button
        onClick={handleDeleteAccount}
        className="myProfile__delete-account"
      >
        Delete account
      </button>
    </div>
  );
};

export default MyAccount;
