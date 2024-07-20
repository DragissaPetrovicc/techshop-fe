import { Alert, Box, Button, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ModalProps } from "../../config/types.ts";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { CustomTextFieldBlack } from "../../Guest/Components/customTextField.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";
import { axiosI, axiosT } from "../../config/axios.ts";
import Loader from "../../CustomLoader.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";
import { UserRoute } from "../../PrivateRoutes.tsx";

const AddCartModal: React.FC<ModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [products1, setProducts1] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const id = useSelector((state: RootState) => state.loggedUser.items.id);
  const navigate = useNavigate();

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
        const { data } = await axiosI.get("/products/all");
        setProducts(data);
      } catch (e) {
        setError(
          e?.response?.data || "Something went wrong, couldn't fetch products"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const makeCart = async () => {
    try {
      setLoading(true);
      const { data } = await axiosT.post("/cart/make", {
        owner: id,
        products: products1,
        name,
      });
      setRes(data);

      setTimeout(() => {
        onClose();
        navigate(ROUTES.MY_CARTS);
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (id: string) => {
    setProducts1((prevProducts1) => {
      if (!prevProducts1.includes(id)) {
        return [...prevProducts1, id];
      }
      return prevProducts1;
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {" "}
        <UserRoute>
          <span className="font-bold text-2xl">
            {t("make")} {t("cart")}
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
          <div className="flex flex-col gap-2 w-full">
            {products.length > 0 &&
              products.map((p) => (
                <Button
                  onClick={() => addProduct(p._id)}
                  key={p.id}
                  className="!bg-black !text-customYellow !w-full !whitespace-nowrap !font-semibold"
                  startIcon={
                    products1.includes(p._id) ? <CheckIcon /> : <AddIcon />
                  }
                >
                  {t("add")} {p.name}
                </Button>
              ))}
          </div>
          <CustomTextFieldBlack
            className="!w-full"
            value={name}
            label={t("name")}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-row w-full justify-between items-center">
            <Button
              onClick={onClose}
              variant="contained"
              color="error"
              startIcon={<CloseIcon />}
            >
              {t("close")}
            </Button>
            <Button
              onClick={makeCart}
              variant="contained"
              color="success"
              endIcon={<AddIcon />}
            >
              {!!loading ? <Loader /> : t("make")}
            </Button>
          </div>{" "}
        </UserRoute>
      </Box>
    </Modal>
  );
};

export default AddCartModal;
