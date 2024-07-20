import { Alert, Box, Button, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ModalProps } from "../../config/types";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Loader from "../../CustomLoader.tsx";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { axiosT } from "../../config/axios.ts";
import AddCartModal from "./AddCart.tsx";

const PutInCartModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const productId = useSelector(
    (state: RootState) => state.reportedArticle.items
  );
  const id = useSelector((state: RootState) => state.loggedUser.items.id);

  const { t } = useTranslation();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [carts, setCarts] = useState<any[]>([]);
  const [res, setRes] = useState<string>("");
  const [openCart, setOpenCart] = useState<boolean>(false);

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
        const { data } = await axiosT.get(`/cart/all/${id}`);
        setCarts(data);
      } catch (e) {
        setError(e?.response?.data || "You still have not carts");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const putArticleInCart = async (cartId: string) => {
    try {
      setLoading(true);
      const { data } = await axiosT.put(`/cart/${cartId}/addProduct`, {
        userId: id,
        productId,
      });
      setRes(data);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "You still have not carts");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange =
    (cartId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        putArticleInCart(cartId);
      }
    };

  const addNewCart = () => {
    onClose();
    setOpenCart(true);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <span className="font-bold text-2xl">{t("carts")}</span>
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

          {carts.length ? (
            carts.map((c) => (
              <FormControlLabel
                key={c._id}
                control={<Checkbox onChange={handleCheckboxChange(c._id)} />}
                label={c.name}
              />
            ))
          ) : (
            <Alert severity="warning" variant="filled">
              You still have not carts added
            </Alert>
          )}

          <Button
            onClick={addNewCart}
            variant="contained"
            color="success"
            className="!w-full"
            startIcon={<AddIcon />}
          >
            {t("add")} {t("cart")}
          </Button>
          <div className="w-full flex flex-row justify-between items-center">
            <Button
              variant="contained"
              color="error"
              endIcon={<CloseIcon />}
              onClick={onClose}
            >
              {t("close")}
            </Button>
            <Button
              variant="contained"
              className="!bg-black !text-customYellow !font-semibold !whitespace-nowrap"
              endIcon={<AddIcon />}
            >
              {!!loading ? <Loader /> : t("add")}
            </Button>
          </div>
        </Box>
      </Modal>
      <AddCartModal open={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
};

export default PutInCartModal;
