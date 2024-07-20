import { Alert, Box, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import { ModalProps } from "../../config/types";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import { RootState } from "../../Redux/config.ts";
import { useSelector } from "react-redux";
import { CustomTextFieldBlack } from "../../Guest/Components/customTextField.ts";
import { UserRoute } from "../../PrivateRoutes.tsx";

const ReportUserModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [additionalMessage, setAdditionalMessage] = useState<string>("");
  const id = useSelector((state: RootState) => state.loggedUser.items.id);
  const reportedUser = useSelector(
    (state: RootState) => state.reportedUser.items
  );

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

  const repUser = async () => {
    try {
      setLoading(true);
      const { data } = await axiosT.post("/reports/user", {
        reportedBy: id,
        reportedUser,
        reason,
        additionalMessage,
      });
      setRes(data);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {" "}
        <UserRoute>
          <span className="font-bold text-2xl">{t("reportUser")}</span>
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
            label={t("reason")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <CustomTextFieldBlack
            label={t("additionalMessage")}
            value={additionalMessage}
            onChange={(e) => setAdditionalMessage(e.target.value)}
          />

          <div className="flex flex-row w-full h-fit items-center justify-between">
            <Button
              startIcon={<CloseIcon />}
              color="error"
              variant="contained"
              onClick={onClose}
            >
              {t("close")}
            </Button>
            <Button
              onClick={repUser}
              className="!bg-black !text-customYellow !font-semibold !whitespace-nowrap"
              endIcon={<SendIcon />}
            >
              {!!loading ? <Loader /> : t("report")}
            </Button>
          </div>
        </UserRoute>
      </Box>
    </Modal>
  );
};

export default ReportUserModal;
