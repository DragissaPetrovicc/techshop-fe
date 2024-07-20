import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const reportedUser = createSlice({
  name: "reportedUser",
  initialState: {
    items: "",
  },
  reducers: {
    setReportedUser: (state, action: PayloadAction<string>) => {
      state.items = action.payload;
    },
  },
});

export const { setReportedUser } = reportedUser.actions;

export default reportedUser.reducer;
