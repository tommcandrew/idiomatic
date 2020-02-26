import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

const MyAccount = () => {
  const { userEmail, userName, registerDate, deleteAccount } = useContext(
    AuthContext
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
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
      {showConfirmModal && (
        <ConfirmModal
          setShowConfirmModal={setShowConfirmModal}
          deleteAccount={deleteAccount}
        />
      )}
    </div>
  );
};

export default MyAccount;
