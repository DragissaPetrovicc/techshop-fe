import React, { useState, useCallback, useEffect } from "react";
import { AdminRoute } from "../../PrivateRoutes.tsx";
import { useTranslation } from "react-i18next";
import { CustomTextField } from "../../Guest/Components/customTextField.ts";
import { InputAdornment, IconButton, Button, Alert } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/config.ts";
import Product from "../../Guest/Components/Product.tsx";
import { searchQ } from "../../Redux/slices/searchQuery.ts";
import { axiosI } from "../../config/axios.ts";
import Loader from "../../CustomLoader.tsx";
import { setMyArticles } from "../../Redux/slices/myArticles.ts";

const AdminHome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);
  const fetchProducts = useCallback(() => {
    setRefreshProducts((prev) => !prev);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosI.get("/products/all");
        dispatch(setMyArticles(data));
      } catch (e) {
        setError(e?.response?.data || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const searchQueryF = async () => {
    try {
      setLoading(true);
      const { data } = await axiosI.get("/products/filter/byName", {
        params: { search },
      });
      dispatch(searchQ(data));
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRoute>
      <div className="w-full h-full flex flex-col gap-12 text-customYellow">
        <b className="text-center text-xl md:text-3xl">
          {t("admin")} {t("home")}
        </b>
        <div className="flex w-full flex-row gap-4 items-center">
          <CustomTextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="!w-full"
            variant="outlined"
            label={t("search")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={searchQueryF}>
                    <SearchIcon className="!text-customYellow" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            variant="contained"
            className="!w-min !whitespace-nowrap !bg-customYellow !text-black !font-bold"
          >
            Admin {t("dashboard")}
          </Button>
        </div>
        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        {!!loading && <Loader />}
        <div className="flex flex-col w-full h-full md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <Product
            key={refreshProducts.toString()}
            fetchProducts={fetchProducts}
          />
        </div>
      </div>

      <div className="flex flex-row w-full items-center justify-between">
        <Button
          onClick={() => navigate(ROUTES.REGISTER)}
          startIcon={<AddIcon />}
          variant="contained"
          className="!w-min !whitespace-nowrap !bg-customYellow !text-black !font-bold"
        >
          {t("add")} {t("user")}
        </Button>
        <Button
          onClick={() => navigate(ROUTES.ADD_ARTICLE)}
          endIcon={<AddIcon />}
          variant="contained"
          className="!w-min !whitespace-nowrap !bg-customYellow !text-black !font-bold"
        >
          {t("add")} {t("atricle")}
        </Button>
      </div>
    </AdminRoute>
  );
};

export default AdminHome;
