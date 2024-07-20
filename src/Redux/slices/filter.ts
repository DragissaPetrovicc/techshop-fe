import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterState } from "../../config/types";

const initialState: FilterState = {
  items: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
