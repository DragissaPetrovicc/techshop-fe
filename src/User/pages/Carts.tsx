import React, { useEffect, useState } from "react";
import { UserRoute } from "../../PrivateRoutes.tsx";
import { useTranslation } from "react-i18next";
import { IconButton, Button, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoupeIcon from "@mui/icons-material/Loupe";
import AddIcon from "@mui/icons-material/Add";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import AddCartModal from "../models/AddCart.tsx";
import { axiosT } from "../../config/axios.ts";
import { RootState } from "../../Redux/config.ts";
import { useSelector } from "react-redux";
import Loader from "../../CustomLoader.tsx";
import { ROUTES } from "../../config/routes.ts";
import Fade from "@mui/material/Fade";
import { format } from "date-fns";
import { CustomTextField } from "../../Guest/Components/customTextField.ts";

const Carts: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openAddCart, setOpenAddCart] = useState<boolean>(false);
  const [carts, setCarts] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const [editingCartId, setEditingCartId] = useState<string | null>(null);

  const id = useSelector((state: RootState) => state.loggedUser.items.id);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/cart/all/${id}`);
        setCarts(data);
      } catch (e) {
        setError(e?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const deleteCart = async (cartId: string) => {
    try {
      const { data } = await axiosT.delete(`/cart/${cartId}`);
      setRes(data);
      setTimeout(() => {
        navigate(ROUTES.MY_CARTS);
      }, 1200);
    } catch (e) {
      setError(e?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const patchCart = async (cartId: string) => {
    try {
      setLoading(true);
      const { data } = await axiosT.patch(`/cart/${cartId}`, { name });
      setRes(data);

      setTimeout(() => {
        navigate(`/cart/${cartId}`);
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (cartId: string) => {
    setEditingCartId(cartId);
  };

  const handleCancelEdit = () => {
    setEditingCartId(null);
  };

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    cartId: string
  ) => {
    e.preventDefault();
    try {
      await patchCart(cartId);
    } catch (error) {
      setError(error.message || "An error occured");
    } finally {
      setEditingCartId(null);
    }
  };

  return (
    <UserRoute>
      <div className="w-full h-full flex flex-col gap-14">
        <span className="text-customYellow text-xl md:text-3xl font-bold text-center">
          {t("carts")}
        </span>

        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        {!!res && (
          <Alert variant="filled" severity="success">
            {res}
          </Alert>
        )}

        {!!loading ? (
          <Loader />
        ) : (
          <table className="w-full mt-4 border-2 border-customYellow">
            <thead>
              <tr className="bg-customYellow text-black font-semibold">
                <th className="py-2 px-4 border-r-2 border-black">
                  {t("name")}
                </th>
                <th className="py-2 px-4 border-r-2 border-black">
                  {t("numberOfProducts")}
                </th>
                <th className="py-2 px-4 border-r-2 border-black">
                  {t("lastEdited")}
                </th>
                <th className="py-2 px-4 border-black">{t("actions")}</th>
              </tr>
            </thead>
            {!!carts && carts.length > 0 ? (
              carts.map((c) => {
                // Konvertuj timestamp u Date objekat i formatiraj
                const formattedDate = format(
                  new Date(parseInt(c.lastEdited)),
                  "dd-MM-yyyy"
                );
                return (
                  <tbody key={c._id}>
                    <tr>
                      <td className="py-2 px-4 border-r-2 border-customYellow text-center">
                        {editingCartId === c._id ? (
                          <Fade in={true}>
                            <form
                              className="flex flex-col justify-center items-center w-full gap-3"
                              onSubmit={(e) => handleFormSubmit(e, c._id)}
                            >
                              <CustomTextField
                                label={t("name")}
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                defaultValue={c.name}
                              />
                              <div className="flex w-full flex-row-reverse justify-between">
                                <Button
                                  variant="contained"
                                  className="!bg-customYellow !text-black !font-semibold"
                                  type="submit"
                                >
                                  {t("continue")}
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={handleCancelEdit}
                                >
                                  {t("cancel")}
                                </Button>
                              </div>
                            </form>
                          </Fade>
                        ) : (
                          c.name
                        )}
                      </td>
                      <td className="py-2 px-4 border-r-2 border-customYellow text-center">
                        {c.products.length}
                      </td>
                      <td className="py-2 px-4 border-r-2 border-customYellow text-center">
                        {formattedDate}
                      </td>
                      <td className="py-2 px-4 border-customYellow flex justify-around">
                        <IconButton
                          onClick={() => navigate(`/cart/${c._id}`)}
                          className="!text-customYellow"
                        >
                          <LoupeIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEditClick(c._id)}
                          className="!text-blue-500"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteCart(c._id)}
                          className="!text-red-500"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  </tbody>
                );
              })
            ) : (
              <tbody>
                <tr>
                  <td colSpan={4} className="py-2 px-4 text-center">
                    <Alert severity="info" variant="filled">
                      {t("no")} {t("carts")}
                    </Alert>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        )}
        <div className="flex flex-row-reverse justify-between items-center w-full">
          <Button
            onClick={() => setOpenAddCart(true)}
            endIcon={<AddIcon />}
            className="!bg-customYellow !text-black !font-semibold !w-min !self-center"
          >
            {t("add")}
          </Button>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<KeyboardBackspaceIcon />}
            className="!bg-customYellow !text-black !font-semibold !w-min !self-center"
          >
            {t("back")}
          </Button>
        </div>
      </div>
      <AddCartModal open={openAddCart} onClose={() => setOpenAddCart(false)} />
    </UserRoute>
  );
};

export default Carts;
