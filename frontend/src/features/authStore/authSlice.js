import { createSlice } from "@reduxjs/toolkit";
import { authReducer } from "../../reducers/auth";
import postInfoReducer from "../../reducers/postInfo";

export const slice = createSlice({
  name: "store",
  initialState: {
    isAuthenticated: false,
    isMod: false,
    isAdmin: false,
    isSuperuser: false,
    postInfo: {
      type: "",
    },
  },
  reducers: {
    checkAuthenticated: authReducer,
    checkPostType: postInfoReducer,
  },
});

export const { checkAuthenticated, checkPostType } = slice.actions;

export default slice.reducer;
