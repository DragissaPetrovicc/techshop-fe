import {
  Button,
  FormControl as MuiFormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Drawer,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import PaymentIcon from "@mui/icons-material/Payment";
import { ROUTES } from "../config/routes.ts";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../Redux/config.ts";
import { useDispatch } from "react-redux";
import { removeCredentials } from "../Redux/slices/loggedUser.ts";
import { axiosI } from "../config/axios.ts";
import { setMyArticles } from "../Redux/slices/myArticles.ts";
import Loader from "../CustomLoader.tsx";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const image = useSelector((state: RootState) => state.loggedUser.items.image);
  const id = useSelector((state: RootState) => state.loggedUser.items.id);

  const [language, setLanguage] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const changeLanguage = useCallback(
    async (value: string) => {
      await i18n.changeLanguage(value);
    },
    [i18n]
  );

  const handleChange = async (event: SelectChangeEvent) => {
    const selectedLanguage = event.target.value as string;
    setLanguage(selectedLanguage);
    await changeLanguage(selectedLanguage);
  };

  const CustomFormControl = styled(MuiFormControl)({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#F2CA2C",
      },
      "&:hover fieldset": {
        borderColor: "#F2CA2C",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#F2CA2C",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#F2CA2C",
    },
    "& .MuiSelect-root": {
      color: "#F2CA2C",
    },
  });

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const myArticles = async () => {
    try {
      setLoading(true);

      const { data } = await axiosI.get(`/products/user/${id}`);
      dispatch(setMyArticles(data));

      handleDrawerClose();
      navigate(ROUTES.HOME);
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    dispatch(removeCredentials());
    handleDrawerClose();
    navigate(ROUTES.LOG_IN);
  };

  const myProfile = async () => {
    await myArticles();
    navigate(ROUTES.MY_PROFILE);
  };

  const settings = () => {
    handleDrawerClose();
    navigate(ROUTES.SETTINGS);
  };

  const payment = () => {
    handleDrawerClose();
    navigate(ROUTES.PAYMENT_METHODS);
  };

  return (
    <div className="p-2 md:p-5 lg:p-8 xl:p-10 w-full h-[85px] md:h-[120px] bg-[#161513] flex flex-row items-center justify-between border-b-2 md:border-b-4 border-customYellow">
      <span className="font-bold text-[#F2CA2C] text-3xl">
        Drago's Tech Shop
      </span>
      <div className="flex flex-row gap-2 md:gap-5 items-center">
        <CustomFormControl fullWidth>
          <InputLabel
            className="!text-customYellow"
            id="demo-simple-select-label"
          >
            {t("language")}
          </InputLabel>
          <Select
            className="!text-customYellow"
            value={language}
            label="Language"
            onChange={handleChange}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="de">Deutsch</MenuItem>
            <MenuItem value="sr">Serbian</MenuItem>
          </Select>
        </CustomFormControl>
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          className="!bg-customYellow !text-black !font-semibold"
        >
          {t("back")}
        </Button>
        {!!token && (
          <img
            src={image}
            className="w-16 h-16 rounded-full border-2 border-customYellow"
            alt=""
            onClick={handleDrawerOpen}
          />
        )}
      </div>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <div className="w-80 p-4 flex flex-col h-full bg-black gap-2 text-customYellow font-semibold">
          {!!error && (
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          )}
          <span
            onClick={myProfile}
            className="w-full p-3 h-max cursor-pointer hover:bg-customYellow hover:text-black"
          >
            {t("myProfile")} <AccountCircleIcon />
          </span>
          <span
            onClick={settings}
            className="w-full p-3 h-max cursor-pointer hover:bg-customYellow hover:text-black"
          >
            {t("settings")} <SettingsIcon />
          </span>
          {!!loading ? (
            <Loader />
          ) : (
            <span
              onClick={myArticles}
              className="w-full p-3 h-max cursor-pointer hover:bg-customYellow hover:text-black"
            >
              {t("myArticles")} <InventoryIcon />
            </span>
          )}
          {role === "USER" && (
            <span
              onClick={payment}
              className="w-full p-3 h-max cursor-pointer hover:bg-customYellow hover:text-black"
            >
              {t("payment")} {t("method")} <PaymentIcon />
            </span>
          )}
          <span
            onClick={logout}
            className="w-full p-3 h-max cursor-pointer hover:bg-customYellow hover:text-black"
          >
            {t("logout")} <LogoutIcon />
          </span>
          <span
            className="w-full p-3 h-max cursor-pointer hover:bg-customYellow hover:text-black"
            onClick={handleDrawerClose}
          >
            {t("close")} <CloseIcon />
          </span>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
