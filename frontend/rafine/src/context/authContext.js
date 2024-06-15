import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    try {
      const res = await axios.post(
        "https://rafine-clone-6.onrender.com/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );

      setCurrentUser(res.data);
    } catch (err) {
      if (err.response && err.response.data) {
        throw new Error(err.response.data); // Hata mesajını fırlat
      } else {
        throw new Error("An unexpected error occurred"); // Genel bir hata fırlat
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "https://rafine-clone-6.onrender.com/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setCurrentUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
