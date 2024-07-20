import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterState } from "../../config/types";

const initialState: FilterState = {
  items: [],
};

const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setSort } = sortSlice.actions;

export default sortSlice.reducer;
