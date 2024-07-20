import { Modal, Box, Button, Alert, TextField } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalProps } from "../../config/types";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { axiosI } from "../../config/axios.ts";
import { useDispatch } from "react-redux";
import { setFilter } from "../../Redux/slices/filter.ts";
import Loader from "../../CustomLoader.tsx";
import { AppDispatch } from "../../Redux/config.ts";
import { removeMyArticles } from "../../Redux/slices/myArticles.ts";

const FilterModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
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

  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const filter = async () => {
    try {
      setLoading(true);
      const { data } = await axiosI.get("/products/filter/price", {
        params: { from, to },
      });
      dispatch(setFilter(data));
      dispatch(removeMyArticles());
      onClose();
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {!!loading ? (
        <Loader />
      ) : (
        <Box sx={style}>
          {!!error && (
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          )}
          <Accordion className="!border-2 !border-black">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {t("filterPrice")}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label={t("from")}
                value={from}
                onChange={(e) => setFrom(Number(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label={t("to")}
                value={to}
                onChange={(e) => setTo(Number(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </AccordionDetails>
          </Accordion>

          <div className="flex flex-row justify-between items-center w-full">
            <Button
              endIcon={<CloseIcon />}
              variant="contained"
              color="error"
              onClick={onClose}
            >
              {t("close")}
            </Button>
            <Button
              endIcon={<FilterAltIcon />}
              variant="contained"
              onClick={filter}
              className="!bg-black !text-customYellow !font-semibold"
            >
              {t("filter")}
            </Button>
          </div>
        </Box>
      )}
    </Modal>
  );
};

export default FilterModal;
