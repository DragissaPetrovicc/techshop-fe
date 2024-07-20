import React, { useState } from "react";
import { ModalProps } from "../../config/types";
import { Modal, Box, Button, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import SortIcon from "@mui/icons-material/Sort";
import { useDispatch } from "react-redux";
import { setSort } from "../../Redux/slices/sort.ts";
import { axiosI } from "../../config/axios.ts";
import Loader from "../../CustomLoader.tsx";
import { AppDispatch } from "../../Redux/config.ts";
import { removeMyArticles } from "../../Redux/slices/myArticles.ts";

const SortModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const [sortByName, setSortByName] = useState<boolean>(false);
  const [sortByPrice, setSortByPrice] = useState<boolean>(false);
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [sortByQuantity, setSortByQuantity] = useState<boolean>(false);
  const [sortByViews, setSortByViews] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

  const sort = async () => {
    try {
      setLoading(true);
      const { data } = await axiosI.get(
        `/products/sort/${
          sortByName
            ? "byName"
            : sortByPrice
            ? "byPrice"
            : sortByDate
            ? "byDate"
            : sortByQuantity
            ? "byQuantity"
            : "byViews"
        }`
      );
      dispatch(setSort(data));
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
      <Box sx={style}>
        {!!error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}
        <FormGroup>
          <FormControlLabel
            control={<Switch onChange={() => setSortByName(!sortByName)} />}
            label={t("sortByName")}
          />
          <FormControlLabel
            control={<Switch onChange={() => setSortByPrice(!sortByPrice)} />}
            label={t("sortByPrice")}
          />
          <FormControlLabel
            control={<Switch onChange={() => setSortByDate(!sortByDate)} />}
            label={t("sortByDate")}
          />
          <FormControlLabel
            control={
              <Switch onChange={() => setSortByQuantity(!sortByQuantity)} />
            }
            label={t("sortByQuantity")}
          />
          <FormControlLabel
            control={<Switch onChange={() => setSortByViews(!sortByViews)} />}
            label={t("sortByViews")}
          />
        </FormGroup>

        <div className="flex flex-row justify-between items-center w-full">
          <Button
            onClick={onClose}
            endIcon={<CloseIcon />}
            variant="contained"
            color="error"
          >
            {t("close")}
          </Button>
          <Button
            onClick={sort}
            endIcon={<SortIcon />}
            variant="contained"
            className="!bg-black !text-customYellow !font-semibold"
          >
            {!!loading ? <Loader /> : t("sort")}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SortModal;
