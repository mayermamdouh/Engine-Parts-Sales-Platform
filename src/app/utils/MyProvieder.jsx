import { createContext, useEffect, useState, useCallback } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

export const UserIdContext = createContext(null);

export default function MyProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [role, setRole] = useState(null);

  const handleLogOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setToken(null);
    setUserId(null);
    router.push("/");
    window.location.reload();
  }, [router]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwt.decode(storedToken);
      if (decodedToken?.exp < Date.now() / 1000) {
        handleLogOut();
      } else if (decodedToken?.id) {
        setUserId(decodedToken.id);
        setRole(decodedToken?.role); 
      }
    }
  }, [handleLogOut]);

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    const decodedToken = jwt.decode(token);
    if (decodedToken?.exp < Date.now() / 1000) {
      handleLogOut(); // Token expired
    } else if (decodedToken?.id) {
      localStorage.setItem("id", decodedToken.id);
      setUserId(decodedToken.id);
      setRole(decodedToken?.role); 
    }
  };

  return (
    <UserIdContext.Provider
      value={{ userId, token, role, saveToken, handleLogOut }}
    >
      {children}
    </UserIdContext.Provider>
  );
}
