import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterState } from "../../config/types";

const initialState: FilterState = {
  items: [],
};

const cartArticles = createSlice({
  name: "cartArticles",
  initialState,
  reducers: {
    setCartArticles: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
    },
    removeCartArticles: (state) => {
      state.items = initialState.items;
    },
  },
});

export const { setCartArticles, removeCartArticles } = cartArticles.actions;

export default cartArticles.reducer;
