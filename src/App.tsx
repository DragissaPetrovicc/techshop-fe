import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./config/routes.ts";
import Home from "./Guest/Home.tsx";
import Login from "./Guest/Login.tsx";
import Register from "./Guest/Register.tsx";
import Header from "./Header&Footer/Header.tsx";
import Footer from "./Header&Footer/Footer.tsx";
import AddArticle from "./User/pages/AddArticle.tsx";
import NotFound from "./NotFound.tsx";
import EditArticle from "./User/pages/EditArticle.tsx";
import ArticleDetails from "./Guest/ArticleDetails.tsx";
import UserDetails from "./Guest/UserDetails.tsx";
import MyProfile from "./User/pages/MyProfile.tsx";
import Settings from "./User/pages/Settings.tsx";
import Carts from "./User/pages/Carts.tsx";
import PaymentMethod from "./User/pages/PaymentMethod.tsx";
import AddPayment from "./User/pages/AddPayment.tsx";
import CartDetails from "./User/pages/CartDetails.tsx";
import AdminDashboard from "./Admin/pages/AdminDashboard.tsx";
import AdminHome from "./Admin/pages/AdminHome.tsx";
import Success from "./User/pages/Success.tsx";
import Cancel from "./User/pages/Cancel.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="p-2 md:p-5 lg:p-8 xl:p-10 w-full h-full overflow-auto bg-[#292929] text-white">
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOG_IN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.ADD_ARTICLE} element={<AddArticle />} />
          <Route path={ROUTES.EDIT_ARTICLE} element={<EditArticle />} />
          <Route path={ROUTES.ARTICLE_DETAILS} element={<ArticleDetails />} />
          <Route path={ROUTES.USER_DETAILS} element={<UserDetails />} />
          <Route path={ROUTES.MY_PROFILE} element={<MyProfile />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.MY_CARTS} element={<Carts />} />
          <Route path={ROUTES.PAYMENT_METHODS} element={<PaymentMethod />} />
          <Route path={ROUTES.ADD_PAYMENT} element={<AddPayment />} />
          <Route path={ROUTES.CART_DETAILS} element={<CartDetails />} />
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_HOME} element={<AdminHome />} />
          <Route path={ROUTES.SUCCESS} element={<Success />} />
          <Route path={ROUTES.CANCEL} element={<Cancel />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
