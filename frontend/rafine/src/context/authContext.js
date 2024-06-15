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
      localStorage.setItem("user", JSON.stringify(res.data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    } catch (err) {
      if (err.response && err.response.data) {
        throw new Error(err.response.data);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${currentUser.token}`;
    }
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
