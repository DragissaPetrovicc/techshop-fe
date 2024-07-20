import { Modal, Box } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { UniversalModalProps } from "./config/types";

const UniversalModal: React.FC<UniversalModalProps> = ({
  open,
  onClose,
  title,
  handleYes,
}) => {
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
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}></Box>
    </Modal>
  );
};
export default UniversalModal;
