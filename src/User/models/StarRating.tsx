import { Alert, Box, Button, Modal, Rating } from "@mui/material";
import React, { useState } from "react";
import { ModalProps } from "../../config/types";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import { RootState } from "../../Redux/config.ts";
import { useSelector } from "react-redux";

const StarRatingModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number | null>(1);
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const id = useSelector((state: RootState) => state.loggedUser.items.id);

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

  const rateApp = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.post("/rate/app", {
        ratedBy: id,
        stars: rating,
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
        <span className="font-bold text-2xl">{t("rate")}</span>
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

        <Rating
          size="large"
          className=" !text-black"
          value={rating}
          onChange={(e, newValue) => {
            setRating(newValue);
          }}
        />
        <div className="w-full h-fit flex flex-row justify-between items-center">
          <Button
            color="error"
            variant="contained"
            onClick={onClose}
            startIcon={<CloseIcon />}
          >
            {t("close")}
          </Button>
          <Button
            onClick={rateApp}
            variant="contained"
            className="!bg-black !text-customYellow !font-semibold !whitespace-nowrap"
            endIcon={<SendIcon />}
          >
            {!!loading ? <Loader /> : t("rate")}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default StarRatingModal;
