import axios from "axios";
import React, { useState, createContext, useEffect } from "react";
import { Redirect } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = props => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const [registerDate, setRegisterDate] = useState();
  const [isNewUser, setIsNewUser] = useState()

  useEffect(() => {
    const token = localStorage.getItem("idiomatic-token");
    if (token) {
      axios
        .get("/checkAuth", {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(res => {
          if (res.data.user) {
            setUserEmail(res.data.user.email);
            setUserName(res.data.user.name);
            setAuthenticated(true);
            setLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const login = e => {
    let errorMessage;
    const email = e.target.email.value;
    const password = e.target.password.value;
    axios
      .post("/login", { email, password })
      .then(res => {
        const { token, userName, registerDate } = res.data;
        localStorage.setItem("idiomatic-token", token);
        setAuthenticated(true);
        setUserEmail(email);
        setUserName(userName);
        setRegisterDate(registerDate);
      })
      .catch(err => {
        //for validation errors
        if (err.response.status === 400 || err.response.status === 403) {
          errorMessage = err.response.data;
          //for server errors
        } else {
          errorMessage = "Unable to connect. Please try later.";
        }
        setErrorMessage(errorMessage);
      });
  };

  const register = e => {
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const password2 = e.target.password2.value;
    let errorMessage;
    axios
      .post("/register", { name, email, password, password2 })
      .then(res => {
        const { token, registerDate } = res.data;
        localStorage.setItem("idiomatic-token", token);
        setAuthenticated(true);
        setIsNewUser(true)
        setUserEmail(email);
        setUserName(name);
        setRegisterDate(registerDate);
      })
      .catch(err => {
        errorMessage = err.response.data;
        setErrorMessage(errorMessage);
      });
  };

  const deleteAccount = () => {
    const token = localStorage.getItem("idiomatic-token");
    axios
      .post(
        "/deleteAccount",
        { email: userEmail },

        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
      .then(() => {
        setAuthenticated(false);
        setErrorMessage("Your account has been deleted.");
        return (
          <Redirect
            to={{
              pathname: "/",
              state: {
                from: props.location
              }
            }}
          />
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("idiomatic-token");
    return <Redirect to="/" />;
  };

  const loginDemo = () => {
    const email = "anna@gmail.com";
    const password = "anna12345";
    axios
      .post("/login", { email, password })
      .then(res => {
        const { token, userName } = res.data;
        localStorage.setItem("idiomatic-token", token);
        setAuthenticated(true);
        setIsNewUser(true)
        setUserEmail(email);
        setUserName(userName);
      })
      .catch(err => {
        console.log(err);
      });
  };


  return (
    <AuthContext.Provider
      value={{
        authenticated,
        errorMessage,
        loading,
        login,
        register,
        setAuthenticated,
        setErrorMessage,
        userEmail,
        userName,
        registerDate,
        deleteAccount,
        logout,
        loginDemo,
        isNewUser,
        setIsNewUser
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
