import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoggedUserState } from "../../config/types";

const initialState: LoggedUserState = {
  items: {
    email: "",
    id: "",
    image: "",
  },
};

const loggedUser = createSlice({
  name: "loggedUser",
  initialState,
  reducers: {
    addEmail: (state, action: PayloadAction<string>) => {
      state.items.email = action.payload;
    },
    addId: (state, action: PayloadAction<string>) => {
      state.items.id = action.payload;
    },
    addImage: (state, action: PayloadAction<string>) => {
      state.items.image = action.payload;
    },
    removeCredentials: (state) => {
      state.items = initialState.items;
    },
  },
});

export const { addEmail, addId, addImage, removeCredentials } =
  loggedUser.actions;

export default loggedUser.reducer;
