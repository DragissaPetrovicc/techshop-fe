import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterState } from "../../config/types";

const initialState: FilterState = {
  items: [],
};

const myArticles = createSlice({
  name: "myArticles",
  initialState,
  reducers: {
    setMyArticles: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
    removeMyArticles: (state) => {
      state.items = initialState.items;
    },
  },
});

export const { setMyArticles, removeMyArticles } = myArticles.actions;

export default myArticles.reducer;
