import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const reportedArticle = createSlice({
  name: "reportedArticle",
  initialState: {
    items: "",
  },
  reducers: {
    setReportedArticle: (state, action: PayloadAction<string>) => {
      state.items = action.payload;
    },
  },
});

export const { setReportedArticle } = reportedArticle.actions;

export default reportedArticle.reducer;
