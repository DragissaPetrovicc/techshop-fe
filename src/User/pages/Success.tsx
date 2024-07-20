import React, { useState } from "react";
import PaidIcon from "@mui/icons-material/Paid";
import { useTranslation } from "react-i18next";
import { Alert, Button } from "@mui/material";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/config.ts";
import { removeCartArticles } from "../../Redux/slices/cartArticles.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";

const Success: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const products = useSelector((state: RootState) => state.cartArticles.items);

  const navigateHome = async () => {
    try {
      const { data } = await axiosT.patch("/products/paymentMade", {
        products,
      });
      console.log(data);
      dispatch(removeCartArticles());
      navigate(ROUTES.HOME);
    } catch (e) {
      console.error(e?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[500px] h-[500px] flex flex-col justify-around bg-customYellow rounded-xl p-8">
        <PaidIcon className="!text-green-600 !text-3xl !self-center" />
        <span className="text-black text-2xl font-extrabold text-center">
          Drago's tech shop
        </span>
        <span className="text-black text-lg font-bold text-center">
          Stripe {t("payment")}
        </span>
        <Alert severity="success" variant="filled" className="!w-full">
          {t("payment")}
        </Alert>

        <Button
          className="!w-min !self-center"
          onClick={navigateHome}
          variant="contained"
          color="success"
        >
          {!!loading ? <Loader /> : t("continue")}
        </Button>
      </div>
    </div>
  );
};

export default Success;
