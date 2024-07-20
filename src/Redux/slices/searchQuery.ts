import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterState } from "../../config/types";

const initialState: FilterState = {
  items: [],
};

const searchQuery = createSlice({
  name: "searchQuery",
  initialState,
  reducers: {
    searchQ: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
  },
});

export const { searchQ } = searchQuery.actions;

export default searchQuery.reducer;
