import { configureStore } from "@reduxjs/toolkit";
import loggedUser from "./slices/loggedUser.ts";
import searchQuery from "./slices/searchQuery.ts";
import filter from "./slices/filter.ts";
import sort from "./slices/sort.ts";
import myAticles from "./slices/myArticles.ts";
import reportedArticle from "./slices/reportedArticle.ts";
import reportedUser from "./slices/reportedUser.ts";
import cartArticles from "./slices/cartArticles.ts";

const store = configureStore({
  reducer: {
    loggedUser: loggedUser,
    searchQuery: searchQuery,
    filter: filter,
    sort: sort,
    myArticles: myAticles,
    reportedArticle: reportedArticle,
    reportedUser: reportedUser,
    cartArticles: cartArticles,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
