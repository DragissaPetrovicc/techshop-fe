import React, { useEffect, useState } from "react";
import { IconButton, Alert, Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReportIcon from "@mui/icons-material/Report";
import { axiosI, axiosT } from "../../config/axios.ts";
import { ProductType } from "../../config/types.ts";
import Loader from "../../CustomLoader.tsx";
import { ProductProps } from "../../config/types.ts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";
import ReportArticleModal from "../../User/models/ReportArticle.tsx";
import { AppDispatch } from "../../Redux/config.ts";
import { useDispatch } from "react-redux";
import { setReportedArticle } from "../../Redux/slices/reportedArticle.ts";
import PutInCartModal from "../../User/models/PutInCart.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { ROUTES } from "../../config/routes.ts";

const Product: React.FC<ProductProps> = ({ fetchProducts }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [res, setRes] = useState<string>("");
  const filterByPrice = useSelector((state: RootState) => state.filter.items);
  const myArticles = useSelector((state: RootState) => state.myArticles.items);
  const cartArticles = useSelector(
    (state: RootState) => state.cartArticles.items
  );
  const sort = useSelector((state: RootState) => state.sort.items);
  const [openArticleModal, setOpenArticleModal] = useState<boolean>(false);
  const [openCartModal, setOpenCartModal] = useState<boolean>(false);
  const searchQuery = useSelector(
    (state: RootState) => state.searchQuery.items
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const { data } = await axiosI.get("/products/all");
        setProducts(data);
      } catch (e) {
        setError(e?.response?.data || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, [fetchProducts]);

  const filteredProducts =
    filterByPrice.length > 0
      ? filterByPrice
      : sort.length > 0
      ? sort
      : searchQuery.length > 0
      ? searchQuery
      : myArticles.length > 0
      ? myArticles
      : cartArticles.length > 0
      ? cartArticles
      : products;

  const handleReportClick = (id: string) => {
    dispatch(setReportedArticle(id));
    setOpenArticleModal(true);
  };

  const handleOpenCartModal = (id: string) => {
    dispatch(setReportedArticle(id));
    setOpenCartModal(true);
  };

  const deleteProduct = async (prodId: string) => {
    try {
      setLoading(true);
      const { data } = await axiosT.delete(`/products/${prodId}`);
      setRes(data);

      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
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

          {filteredProducts.map((prod) => (
            <div
              key={prod._id}
              className="flex flex-col gap-2 w-full max-w-[400px] border-2 border-customYellow rounded-xl"
            >
              <img
                onClick={() => navigate(`/article/${prod._id}`)}
                className="rounded-t-md object-cover w-full h-[250px] cursor-pointer"
                src={prod.image}
                alt=""
              />
              <div
                onClick={() => navigate(`/article/${prod._id}`)}
                className="flex flex-col gap-2 w-full h-full cursor-pointer"
              >
                <span className="p-2 text-customYellow font-semibold text-lg">
                  {t("name")}: {prod.name}
                </span>
                <span className="p-2 text-customYellow font-medium text-md">
                  {t("price")}: {prod.price}$
                </span>
              </div>

              {myArticles.length > 0 ? (
                <div className="flex flex-row-reverse p-2 justify-between items-center">
                  <IconButton
                    onClick={() => deleteProduct(prod._id)}
                    size="large"
                    className="!bg-red-500 !text-black font-bold"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    onClick={() => navigate(`/editArticle/${prod._id}`)}
                    variant="contained"
                    className="!bg-customYellow !text-black !font-semibold !whitespace-nowrap !w-min"
                  >
                    {t("edit")}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-row-reverse p-2 justify-between items-center">
                  <IconButton
                    onClick={() => handleOpenCartModal(prod._id)}
                    size="large"
                    className="!bg-customYellow !text-black font-bold"
                  >
                    <AddShoppingCartIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleReportClick(prod._id)}
                    size="large"
                    className="!bg-customYellow !text-black font-bold"
                  >
                    <ReportIcon />
                  </IconButton>
                </div>
              )}
            </div>
          ))}
        </>
      )}
      <ReportArticleModal
        open={openArticleModal}
        onClose={() => setOpenArticleModal(false)}
      />
      <PutInCartModal
        open={openCartModal}
        onClose={() => setOpenCartModal(false)}
      />
    </>
  );
};

export default Product;
