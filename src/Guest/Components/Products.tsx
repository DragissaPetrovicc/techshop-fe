import React, { useState, useCallback } from "react";
import { Button, ButtonGroup, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import FilterModal from "../Models/FilterModal.tsx";
import SortModal from "../Models/SortModal.tsx";
import { ROUTES } from "../../config/routes.ts";
import { useNavigate } from "react-router-dom";
import Product from "./Product.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/config.ts";
import { removeMyArticles } from "../../Redux/slices/myArticles.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";
import { removeCartArticles } from "../../Redux/slices/cartArticles.ts";

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);
  const fetchProducts = useCallback(() => {
    setRefreshProducts((prev) => !prev);
    dispatch(removeMyArticles());
    dispatch(removeCartArticles());
  }, [dispatch]);

  const cartArticles = useSelector(
    (state: RootState) => state.cartArticles.items
  );
  const myArticles = useSelector((state: RootState) => state.myArticles.items);
  const role = localStorage.getItem("role");

  return (
    <>
      <div className="w-full h-min flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Product
          key={refreshProducts.toString()}
          fetchProducts={fetchProducts}
        />
      </div>
      <Button
        onClick={fetchProducts}
        variant="contained"
        color="success"
        sx={{
          width: "min-content",
          whiteSpace: "nowrap",
          alignSelf: "center",
        }}
      >
        {myArticles.length > 0 || cartArticles.length > 0
          ? t("products")
          : t("showMore")}
      </Button>
      {role === "USER" && (
        <div className="flex flex-row justify-between w-full">
          <ButtonGroup className="!self-center !border-black">
            <Button
              onClick={() => setOpenFilter(true)}
              className="!rounded-l-full !bg-customYellow !text-black !border-r-2 !font-semibold"
              variant="contained"
            >
              {t("filter")}
            </Button>
            <Button
              onClick={() => setOpenSort(true)}
              className="!rounded-r-full !border-l-4 !border-black !bg-customYellow !text-black !font-semibold"
              variant="contained"
            >
              {t("sort")}
            </Button>
          </ButtonGroup>
          <IconButton
            onClick={() => navigate(ROUTES.ADD_ARTICLE)}
            size="large"
            className="!bg-customYellow !w-min !whitespace-nowrap !self-end !text-black !font-semibold"
          >
            <AddIcon />
          </IconButton>
        </div>
      )}
      <FilterModal open={openFilter} onClose={() => setOpenFilter(false)} />
      <SortModal open={openSort} onClose={() => setOpenSort(false)} />
    </>
  );
};

export default Products;
