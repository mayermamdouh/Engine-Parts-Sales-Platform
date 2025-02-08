import { createSlice } from "@reduxjs/toolkit";
import jwt from "jsonwebtoken";


const initialState = {
  token: null,
  userId: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const token = action.payload;
      const decodedToken = jwt.decode(token);
      state.token = token;
      state.userId = decodedToken?.id;
      state.role = decodedToken?.role;
      localStorage.setItem("token", token);
    },
    logout: (state, action) => {
      state.token = null;
      state.userId = null;
      state.role = null;
      localStorage.removeItem("token");
      console.log("Logged out");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
