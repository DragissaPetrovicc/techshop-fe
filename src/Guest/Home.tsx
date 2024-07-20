import React, { useEffect, useState } from "react";
import {
  IconButton,
  InputAdornment,
  Button,
  ButtonGroup,
  styled,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { CustomTextField } from "./Components/customTextField.ts";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes.ts";
import Products from "./Components/Products.tsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Redux/config.ts";
import { searchQ } from "../Redux/slices/searchQuery.ts";
import Loader from "../CustomLoader.tsx";
import { axiosI, axiosT } from "../config/axios.ts";
import StarRatingModal from "../User/models/StarRating.tsx";
import { RootState } from "../Redux/config.ts";
import { removeMyArticles } from "../Redux/slices/myArticles.ts";

const CustomButtonGroup = styled(ButtonGroup)({
  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
    borderColor: "#F2CA2C",
  },
  "& .MuiButtonGroup-grouped:not(:first-of-type)": {
    borderColor: "#F2CA2C",
  },
});

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("token");
  const [openRatingModal, setOpenRatingModal] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: RootState) => state.loggedUser.items.id);

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

  useEffect(() => {
    const checkIsUserRatedApp = async () => {
      try {
        const { data } = await axiosT.get(`/user/${id}`);
        dispatch(removeMyArticles());
        if (data.rated === false) {
          setTimeout(() => {
            setOpenRatingModal(true);
          }, 5000);
        }
      } catch (e) {
        console.error(
          e?.response?.data || "Couldn't check are you rated application"
        );
      }
    };
    checkIsUserRatedApp();
  }, [id, dispatch]);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="flex w-full flex-row gap-4 items-center">
        {!!error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}
        <CustomTextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!w-full"
          variant="outlined"
          label={t("search")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {!!loading ? (
                  <Loader />
                ) : (
                  <IconButton onClick={searchQueryF}>
                    <SearchIcon className="!text-customYellow" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        {token ? (
          <IconButton onClick={() => navigate(ROUTES.MY_CARTS)}>
            <ShoppingCartOutlinedIcon className="!text-customYellow" />
          </IconButton>
        ) : (
          <CustomButtonGroup variant="text">
            <Button
              onClick={() => navigate(ROUTES.LOG_IN)}
              variant="outlined"
              className="!text-customYellow !whitespace-nowrap"
            >
              {t("login")}
            </Button>
            <Button
              onClick={() => navigate(ROUTES.REGISTER)}
              variant="outlined"
              className="!text-customYellow !whitespace-nowrap"
            >
              {t("register")}
            </Button>
          </CustomButtonGroup>
        )}
      </div>
      <Products />
      <StarRatingModal
        open={openRatingModal}
        onClose={() => setOpenRatingModal(false)}
      />
    </div>
  );
};

export default Home;
