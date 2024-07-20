import { Modal, Box, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalProps } from "../../config/types";
import { CustomTextFieldBlack } from "../Components/customTextField.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";
import { axiosI } from "../../config/axios.ts";
import Loader from "../../CustomLoader.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";

const VerifyModal: React.FC<
  ModalProps & { resolve: (value: boolean) => void }
> = ({ open, onClose, resolve }) => {
  const email = useSelector((state: RootState) => state.loggedUser.items.email);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const navigate = useNavigate();

  const { t } = useTranslation();
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#F2CA2C",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyItems: "center",
    alignItems: "center",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
    gap: 2,
  };

  const verify = async () => {
    try {
      setLoading(true);

      const { data } = await axiosI.post("/register/verify", { email, code });
      setResponse(data);

      setTimeout(() => {
        onClose();
        resolve(true);
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    onClose();
    resolve(true);
    navigate(ROUTES.HOME);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        {!!response && (
          <Alert variant="filled" severity="success">
            {response}
          </Alert>
        )}
        <CustomTextFieldBlack
          value={code}
          onChange={(e) => setCode(e.target.value)}
          label={t("code")}
        />

        <div className="flex flex-row justify-between items-center w-full">
          <Button variant="contained" color="error" onClick={handleContinue}>
            {t("continue")}
          </Button>
          <Button
            variant="contained"
            onClick={verify}
            className="!bg-black !text-customYellow !font-semibold"
          >
            {!!loading ? <Loader /> : t("verify")}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default VerifyModal;
