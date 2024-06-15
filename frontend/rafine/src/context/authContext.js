import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

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
        throw new Error(err.response.data);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get(
        "https://rafine-clone-6.onrender.com/api/auth/user",
        {
          withCredentials: true,
        }
      );

      setCurrentUser(res.data);
    } catch (err) {
      console.error(err);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
