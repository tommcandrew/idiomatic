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
    <>
      <h1 className="myAccount__title">MY ACCOUNT</h1>
      <ul>
        <li>Name: {userName}</li>
        <li>Email: {userEmail}</li>
        <li>Member since: {registerDate}</li>
        <li>Number of texts studied: {}</li>
      </ul>
      <button onClick={handleDeleteAccount}>Delete account</button>
    </>
  );
};

export default MyAccount;
