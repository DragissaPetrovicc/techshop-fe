import React, { useEffect, useState } from "react";
import { UserRoute } from "../../PrivateRoutes.tsx";
import { useTranslation } from "react-i18next";
import { Alert, Button } from "@mui/material";
import { CustomTextFieldBlack } from "../../Guest/Components/customTextField.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";

const AddPayment: React.FC = () => {
  const [cardHolder, setCardHolder] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiringDate, setCardExpiringDate] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const navigate = useNavigate();
  const id = useSelector((state: RootState) => state.loggedUser.items.id);
  const email = useSelector((state: RootState) => state.loggedUser.items.email);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log(email);
        const { data } = await axiosT.get(`/user/${id}`);
        setState(data?.location?.state);
      } catch (e) {
        setError(e?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, email]);

  const addPayment = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.post("/payment/method", {
        email,
        country: state,
        cardHolder,
        cardInfo: { cardNumber, expiring: cardExpiringDate, cvc },
      });
      setRes(data);

      setTimeout(() => {
        navigate(ROUTES.PAYMENT_METHODS);
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslation();

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
        <div className="w-full gap-2 bg-customYellow border-4 border-black text-black h-full lg:w-1/2 flex self-center flex-col p-3 rounded-xl justify-center items-start">
          <span className="text-lg md:text-2xl font-bold self-center">
            {t("card")}
          </span>
          <CustomTextFieldBlack
            className="!w-full"
            label="Card holder"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
          />
          <CustomTextFieldBlack
            className="!w-full"
            label="Card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <CustomTextFieldBlack
            className="!w-full"
            label="Card expiring date"
            value={cardExpiringDate}
            onChange={(e) => setCardExpiringDate(e.target.value)}
          />
          <CustomTextFieldBlack
            className="!w-full"
            label="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />

          {!!loading ? (
            <Loader />
          ) : (
            <Button
              onClick={addPayment}
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
export default AddPayment;
