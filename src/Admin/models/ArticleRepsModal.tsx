import React, { useEffect, useState } from "react";
import { RepDetailsModalProps } from "../../config/types";
import { Modal, Box, Button, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { axiosT } from "../../config/axios.ts";
import Loader from "../../CustomLoader.tsx";

const ArticleRepModal: React.FC<RepDetailsModalProps> = ({
  open,
  onClose,
  id,
}) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rep, setRep] = useState<any>(null);

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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const { data } = await axiosT.get(`/admin/report/article/${id}`);
        setRep(data);
      } catch (e) {
        setError(e?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <span className="font-bold text-2xl">{t("reportedArticle")}</span>

        {!!error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}
        {!!loading && <Loader />}
        <div className="flex flex-row w-full justify-between items-center font-semibold">
          <span>
            {t("report")}:
            <br />
            <b>{rep?.reportedBy?.username}</b>
          </span>
          <span>
            {t("reportedArticle")}:
            <br />
            <b>{rep?.reportedArticle?.name}</b>
          </span>
        </div>

        <span className="font-semibold text-lg">
          {t("reason")}: <b>{rep?.reason}</b>
        </span>
        {!!rep?.additionalMessage && (
          <span className="font-semibold text-lg">
            {t("additionalMessage")}: <b>{rep.additionalMessage}</b>
          </span>
        )}

        <Button
          onClick={() => onClose()}
          startIcon={<CloseIcon />}
          variant="contained"
          color="error"
        >
          {t("close")}
        </Button>
      </Box>
    </Modal>
  );
};
export default ArticleRepModal;
