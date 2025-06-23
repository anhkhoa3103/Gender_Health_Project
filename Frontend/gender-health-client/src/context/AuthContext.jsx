import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); // ✅ đọc userInfo từ localStorage

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          setUser(null);
        } else {
          setUser({ id: decoded.sub, ...decoded, ...userInfo }); // ✅ kết hợp token và thông tin người dùng
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        setUser(null);
      }
    }
  }, []);

  const login = (token, userInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    const decoded = jwtDecode(token);
    setUser({ id: decoded.sub, ...decoded, ...userInfo }); // ✅ hợp nhất token và userInfo
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.clear(); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
