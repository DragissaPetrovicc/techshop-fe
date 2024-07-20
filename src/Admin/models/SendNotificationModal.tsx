import React, { useState } from "react";
import { ModalProps } from "../../config/types";
import { Modal, Box, Button, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CustomTextFieldBlack } from "../../Guest/Components/customTextField.ts";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { axiosT } from "../../config/axios.ts";
import Loader from "../../CustomLoader.tsx";

const SendNotificationModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  const sendNotification = async () => {
    try {
      setLoading(true);
      const { data } = await axiosT.post("/admin/sendNotification", { msg });
      setRes(data);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e) {
      setError(e?.response?.data || "Couldn't send email notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <span className="font-bold text-2xl">{t("sendNotification")}</span>

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

        <CustomTextFieldBlack
          label={t("sendNotification")}
          fullWidth
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <div className="flex flex-row w-full justify-between items-center">
          <Button
            onClick={() => onClose()}
            startIcon={<CloseIcon />}
            variant="contained"
            color="error"
          >
            {t("close")}
          </Button>
          <Button
            onClick={sendNotification}
            endIcon={<SendIcon />}
            variant="contained"
            className="!w-min !whitespace-nowrap !bg-black !text-customYellow !font-semibold"
          >
            {!!loading ? <Loader /> : t("send")}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
export default SendNotificationModal;
