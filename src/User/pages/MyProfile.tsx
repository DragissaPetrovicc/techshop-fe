import React, { useState, useCallback, useEffect } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Button, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import Product from "../../Guest/Components/Product.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";
import { UserRoute } from "../../PrivateRoutes.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/config.ts";
import { axiosT, axiosI } from "../../config/axios.ts";
import { setMyArticles } from "../../Redux/slices/myArticles.ts";
import Loader from "../../CustomLoader.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";

const MyProfile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const id = useSelector((state: RootState) => state.loggedUser.items.id);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);
  const fetchProducts = useCallback(() => {
    setRefreshProducts((prev) => !prev);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/user/${id}`);
        setUser(data);
        const usersArticles = async () => {
          try {
            setLoading(true);

            const { data } = await axiosI.get(`/products/user/${id}`);
            dispatch(setMyArticles(data));
          } catch (e) {
            setError(e?.response?.data || "Something went wrong");
          } finally {
            setLoading(false);
          }
        };
        usersArticles();
      } catch (e) {
        setError(e?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, dispatch]);
  return (
    <UserRoute>
      <div className="flex flex-col lg:flex-row w-full h-full gap-4">
        <div className="w-full lg:w-1/4 h-full flex flex-col p-3 border-2 gap-10 border-customYellow rounded-lg sticky">
          <span className="text-center font-medium">{t("owner")}</span>
          {!!loading && <Loader />}
          {!!error && (
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          )}
          <div className="w-full h-fit flex flex-row items-center justify-around">
            <img
              className="rounded-full w-16 h-16 lg:w-24 lg:h-24 border-2 border-customYellow"
              src={user?.image}
              alt=""
            />
            <span className="font-medium text-md">
              {user?.username} {user?.verification === true && <VerifiedIcon />}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-md">
              {t("firstName")}: <b>{user?.firstName}</b>
            </span>
            <span className="text-md">
              {t("lastName")}: <b>{user?.lastName}</b>
            </span>
            <b className="mt-2">{t("contact")}:</b>

            <span className="text-md">
              {t("email")}: <b>{user?.email}</b>
            </span>
            <span className="text-md">
              {t("phoneNumber")}: <b>{user?.phoneNumber}</b>
            </span>
            <span className="text-md mt-2">
              {t("role")}: <b>{user?.role}</b>
            </span>
            <b className="mt-2">{t("location")}:</b>
            <span className="text-md">
              {t("state1")}: <b>{user?.location.state}</b>
            </span>
            <span className="text-md">
              {t("city1")}: <b>{user?.location.city}</b>
            </span>
          </div>
          <div className="flex flex-col justify-between items-center w-full gap-3">
            <Button
              onClick={() => navigate(ROUTES.SETTINGS)}
              variant="contained"
              className="!bg-customYellow !text-black !font-semibold !w-full "
            >
              {t("changeCredentials")}
            </Button>
            <Button
              onClick={() => navigate(ROUTES.PAYMENT_METHODS)}
              variant="contained"
              className="!bg-customYellow !text-black !font-semibold !w-full "
            >
              {t("payment")} {t("method")}
            </Button>
          </div>
        </div>
        <div className="flex-grow flex flex-col gap-10">
          <span className="text-customYellow text-xl font-semibold text-center">
            {t("myArticles")}
          </span>
          <div className="w-full gap-4 h-min flex flex-col lg:grid lg:grid-cols-3 overflow-auto">
            <Product
              key={refreshProducts.toString()}
              fetchProducts={fetchProducts}
            />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};
export default MyProfile;
