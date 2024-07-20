import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { ROUTES } from "../config/routes.ts";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "react-phone-number-input/style.css";
import "./Components/input.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../CustomLoader.tsx";
import { axiosI } from "../config/axios.ts";
import { addEmail, addId, addImage } from "../Redux/slices/loggedUser.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/config.ts";
import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig.ts";
import { CustomUserCredential } from "../config/types.ts";
import { CustomTextFieldBlack } from "./Components/customTextField.ts";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!!token && role === "USER") {
      navigate(ROUTES.HOME);
    } else if (!!token && role === "ADMIN") {
      navigate(ROUTES.ADMIN_HOME);
    }
  }, [token, role, navigate]);

  const login = async () => {
    try {
      setLoading(true);
      const { data } = await axiosI.post("/login/user", { username, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.data.role);
      dispatch(addImage(data.data.image));
      dispatch(addId(data.data._id));
      dispatch(addEmail(data.data.email));
      if (data.data.role === "ADMIN") {
        navigate(ROUTES.ADMIN_HOME);
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fbLogin = async () => {
    try {
      setLoading(true);

      const provider = new FacebookAuthProvider();
      const result = (await signInWithPopup(
        auth,
        provider
      )) as CustomUserCredential;

      const tokenResponse = result._tokenResponse;

      const firstName = tokenResponse?.firstName;
      const lastName = tokenResponse?.lastName;
      const user = result.user;
      const username = user.displayName;
      const email = user.email;
      const password = user.uid;
      const image = user.photoURL;
      const phoneNumber = user.phoneNumber ? user.phoneNumber : "+38700111222";
      const location = { city: "N/A", state: "N/A" };

      const { data } = await axiosI.post("/register/user", {
        firstName,
        lastName,
        username,
        email,
        password,
        image,
        phoneNumber,
        location,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.data.role);
      dispatch(addImage(data.data.image));
      dispatch(addId(data.data._id));
      dispatch(addEmail(data.data.email));
      if (data.data.role === "ADMIN") {
        navigate(ROUTES.ADMIN_HOME);
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = (await signInWithPopup(
        auth,
        provider
      )) as CustomUserCredential;

      const tokenResponse = result._tokenResponse;

      const firstName = tokenResponse?.firstName;
      const lastName = tokenResponse?.lastName;
      const user = result.user;
      const username = user.displayName;
      const email = user.email;
      const password = user.uid;
      const image = user.photoURL;
      const phoneNumber = user.phoneNumber ? user.phoneNumber : "+38700111222";
      const location = { city: "N/A", state: "N/A" };

      const { data } = await axiosI.post("/register/user", {
        firstName,
        lastName,
        username,
        email,
        password,
        image,
        phoneNumber,
        location,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.data.role);
      dispatch(addImage(data.data.image));
      dispatch(addId(data.data._id));
      dispatch(addEmail(data.data.email));
      if (data.data.role === "ADMIN") {
        navigate(ROUTES.ADMIN_HOME);
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (e) {
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      <span className="text-customYellow text-xl lg:text-3xl mt-4 lg:mt-0 text-left font-bold">
        {t("login")}
      </span>
      <div className="w-full lg:w-1/2 h-full justify-evenly p-2 md:p-4 gap-2 flex flex-col bg-customYellow rounded-lg">
        {!!error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        <CustomTextFieldBlack
          variant="outlined"
          label={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <FormControl
          sx={{ m: 0, width: "100%" }}
          className="!border-black"
          variant="outlined"
        >
          <InputLabel
            className="!border-black"
            htmlFor="outlined-adornment-password"
          >
            {t("password")}
          </InputLabel>
          <OutlinedInput
            className="!border-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button
          onClick={login}
          variant="contained"
          className="!bg-black !font-semibold !text-customYellow !whitespace-nowrap !self-center !w-min"
        >
          {!!loading ? <Loader /> : t("login")}
        </Button>

        <span className="hidden md:flex md:flex-row md:items-center md:justify-center gap-2 md:text-slate-500 md:text-lg md:font-extrabold">
          -------------------------------------------
          <h1 className="text-2xl">{t("or")}</h1>
          -------------------------------------------
        </span>

        <h1 className="text-2xl text-center text-slate-500 font-extrabold md:hidden">
          {t("or")}
        </h1>

        <Button
          onClick={fbLogin}
          endIcon={<FacebookIcon />}
          variant="contained"
          size="large"
          className="!bg-black !font-semibold !text-customYellow !whitespace-nowrap !self-center !w-fit"
        >
          {!!loading ? <Loader /> : t("continueWithFB")}
        </Button>

        <Button
          onClick={googleLogin}
          endIcon={<GoogleIcon />}
          variant="contained"
          size="large"
          className="!bg-black !font-semibold !text-customYellow !whitespace-nowrap !self-center !w-fit"
        >
          {!!loading ? <Loader /> : t("continueWithGoogle")}
        </Button>

        <Button
          onClick={() => navigate(ROUTES.HOME)}
          endIcon={<PersonIcon />}
          variant="contained"
          size="large"
          className="!bg-black !font-semibold !text-customYellow !whitespace-nowrap !self-center !w-fit"
        >
          {t("continueAsGuest")}
        </Button>

        <span className="font-semibold text-lg  text-black text-center">
          {t("noAccount")}
          <a
            className="ml-2 hover:underline cursor-pointer font-bold"
            href={ROUTES.REGISTER}
          >
            {t("register")}
          </a>
        </span>
      </div>
    </div>
  );
};

export default Login;
