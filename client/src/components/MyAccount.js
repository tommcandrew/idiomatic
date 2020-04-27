import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import DeviceContext from '../context/DeviceContext'
import ConfirmModal from "./ConfirmModal";

const MyAccount = () => {
  const { userEmail, userName, deleteAccount, logout } = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { device } = useContext(DeviceContext)

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };
  return (
    <div className="myAccount__wrapper">
      <h1 className="myAccount__title">MY ACCOUNT</h1>
      <ul className="myAccount__list">
        <li>Name: {userName}</li>
        <li>Email: {userEmail}</li>
      </ul>
      {device === "mobile" && <button
        onClick={logout}
        className="myAccount__logout"
      >
        Log out
      </button>}
      <button
        onClick={handleDeleteAccount}
        className="myAccount__delete-account"
      >
        Delete account
      </button>
      {showConfirmModal && (
        <ConfirmModal
          setShowConfirmModal={setShowConfirmModal}
          actionOnConfirm={deleteAccount}
          thingToDelete="your account"
        />
      )}
    </div>
  );
};

export default MyAccount;
