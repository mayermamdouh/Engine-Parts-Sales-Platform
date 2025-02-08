"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import jwt from "jsonwebtoken";
import { login, logout } from "../store/slices/authSlice";
import useLogout from "./Logout";
function AuthInitializer() {
  const dispatch = useDispatch();
  const performLogout = useLogout();

  useEffect(() => {
    setTimeout(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const decodedToken = jwt.decode(storedToken);
        if (decodedToken?.exp && decodedToken.exp < Date.now() / 1000) {
          performLogout();
        } else {
          dispatch(login(storedToken));
        }
      }
    }, 0); // Move check to next event loop cycle
  }, [dispatch, performLogout]);


  return null;
}
export default AuthInitializer;
