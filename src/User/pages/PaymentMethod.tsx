import React, { useEffect, useState } from "react";
import { UserRoute } from "../../PrivateRoutes.tsx";
import { useTranslation } from "react-i18next";
import { Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";
import { axiosT } from "../../config/axios.ts";
import Loader from "../../CustomLoader.tsx";

const PaymentMethod: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const email = useSelector((state: RootState) => state.loggedUser.items.email);
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/payment/method/${email}`);
        setCard(data);
      } catch (e) {
        setError(e?.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);

  const deletePayment = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.delete(`/payment/${card?._id}`);
      setRes(data);

      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <div className="w-full h-full flex flex-col gap-12 ">
        <span className="text-customYellow text-center text-xl md:text-3xl">
          {t("payment")} {t("method")}
        </span>
        {!!error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}
        {!!res && (
          <Alert severity="success" variant="filled">
            {res}
          </Alert>
        )}

        {!!loading && <Loader />}
        <div className="w-full bg-customYellow border-4 border-black text-black h-full lg:w-1/2 flex self-center flex-col p-3 rounded-xl justify-center items-start">
          <span className="text-lg md:text-xl self-center font-bold">
            {t("card")}
          </span>
          <span className="text-lg bg-blend-darken mt-8">
            {t("email")}: <b>{card?.email}</b>
          </span>
          <span className="text-lg bg-transparent">
            {t("state1")}: <b>{card?.country}</b>
          </span>
          <span className="text-lg bg-blend-darken">
            Card Holder: <b>{card?.cardHolder}</b>
          </span>
          <b className="mt-3">Card Info: </b>
          <span className="text-lg bg-transparent">
            Card Number: <b>{card?.cardInfo.cardNumber}</b>
          </span>
          <span className="text-lg bg-transparent">
            Expiring date: <b>{card?.cardInfo.expiring}</b>
          </span>

          <span className="text-lg bg-transparent">
            CVC: <b>{card?.cardInfo.cvc}</b>
          </span>

          {!!card ? (
            <Button
              onClick={deletePayment}
              className="!bg-black !text-customYellow !w-min !whitespace-nowrap !self-center !mt-12"
              variant="contained"
            >
              {t("delete")}
            </Button>
          ) : (
            <Button
              onClick={() => navigate(ROUTES.ADD_PAYMENT)}
              className="!bg-black !text-customYellow !w-min !whitespace-nowrap !self-center !mt-12"
              variant="contained"
            >
              {t("add")} {t("payment")} {t("method")}
            </Button>
          )}
        </div>
      </div>
    </UserRoute>
  );
};
export default PaymentMethod;
