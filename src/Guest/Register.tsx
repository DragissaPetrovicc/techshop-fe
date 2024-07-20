import React, { useState, useEffect } from "react";
import image1 from "../images/image1.png";
import {
  TextField,
  Autocomplete,
  Box,
  Alert,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { addEmail, addId, addImage } from "../Redux/slices/loggedUser.ts";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "react-phone-number-input/style.css";
import "./Components/input.css";
import PhoneInput from "react-phone-number-input";
import { countries } from "./Components/countries.ts";
import { useTranslation } from "react-i18next";
import Loader from "../CustomLoader.tsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/config.ts";
import { ROUTES } from "../config/routes.ts";
import { axiosI, axiosT } from "../config/axios.ts";
import VerifyModal from "./Models/VerifyModal.tsx";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [openVerifyModal, setOpenVerifyModal] = useState<boolean>(false);
  const [resolveVerifyModal, setResolveVerifyModal] = useState<
    (value: boolean) => void
  >(() => {});

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!!token && role !== "ADMIN") {
      navigate(ROUTES.HOME);
    }
  }, [token, role, navigate]);

  const imgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleCountryChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: { label: string } | null
  ) => {
    setSelectedCountry(value ? value.label : "");
    setSelectedCity("");
  };

  const handleCityChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    setSelectedCity(value ? value : "");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneNumber(value || "");
  };

  const register = async () => {
    if (role === "ADMIN") {
      await adminAddUser();
    } else if (role === "USER" || !role) {
      await registerUser();
    }
  };

  const adminAddUser = async () => {
    try {
      setLoading(true);

      const { data } = await axiosT.post("/admin/addUser", {
        firstName,
        lastName,
        username,
        email,
        password,
        role: userRole,
        phoneNumber,
        location: { state: selectedCountry, city: selectedCity },
      });
      setRes(data);

      setTimeout(() => {
        navigate(ROUTES.ADMIN_HOME);
      }, 1200);
    } catch (e) {
      setError(e?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    try {
      setLoading(true);

      const { data } = await axiosI.post("/register/user", {
        firstName,
        lastName,
        username,
        email,
        password,
        image,
        phoneNumber,
        location: { state: selectedCountry, city: selectedCity },
      });
      dispatch(addEmail(data.data.email));

      await new Promise<boolean>((resolve) => {
        setResolveVerifyModal(() => resolve);
        setOpenVerifyModal(true);
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.data.role);
      dispatch(addImage(data.data.image));
      dispatch(addId(data.data._id));
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
    <div className="w-full h-full flex flex-col lg:flex-row-reverse gap-2">
      <div className="w-full lg:w-1/2 h-full p-4 gap-2 flex flex-col bg-customYellow rounded-lg">
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
        <TextField
          variant="outlined"
          label={t("firstName")}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          variant="outlined"
          label={t("lastName")}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          variant="outlined"
          label={t("username")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          label={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl variant="standard" fullWidth>
          <PhoneInput
            placeholder={t("phoneNumber")}
            className="custom-phone-input"
            value={phoneNumber}
            onChange={handlePhoneChange}
          />
        </FormControl>
        <FormControl sx={{ m: 0, width: "100%" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            {t("password")}
          </InputLabel>
          <OutlinedInput
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
        <Autocomplete
          sx={{ width: "100%" }}
          options={countries}
          autoHighlight
          getOptionLabel={(option) => option.label}
          onChange={handleCountryChange}
          value={countries.find((c) => c.label === selectedCountry) || null}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <img
                loading="lazy"
                width="20"
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                alt=""
              />
              {option.label} ({option.code})
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t("state")}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
              }}
            />
          )}
        />

        <Autocomplete
          sx={{ width: "100%" }}
          options={
            selectedCountry
              ? countries.find((c) => c.label === selectedCountry)?.cities || []
              : []
          }
          autoHighlight
          getOptionLabel={(option) => option}
          onChange={handleCityChange}
          value={selectedCity}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={t("city")}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
              }}
            />
          )}
        />
        <div className="w-full h-fit flex flex-row items-center justify-between">
          {role === "USER" || !role ? (
            <Button
              className="!bg-black !text-customYellow !font-semibold "
              component="label"
              variant="contained"
              endIcon={<CloudUploadIcon />}
            >
              {t("choseImage")}
              <VisuallyHiddenInput type="file" onChange={imgUpload} />
            </Button>
          ) : (
            <FormControl>
              <FormLabel className="!text-black !font-medium">
                {t("role")}
              </FormLabel>
              <RadioGroup
                className="!text-black"
                row
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <FormControlLabel
                  className="!text-black"
                  value="USER"
                  control={<Radio />}
                  label="USER"
                />
                <FormControlLabel
                  className="!text-black"
                  value="ADMIN"
                  control={<Radio />}
                  label="ADMIN"
                />
              </RadioGroup>
            </FormControl>
          )}
          <Button
            onClick={register}
            className="!bg-black !text-customYellow !font-semibold !w-1/4"
          >
            {!!loading ? <Loader /> : t("register")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-between w-full gap-3 lg:w-1/2 h-full">
        <span className="text-customYellow text-xl lg:text-3xl mt-4 lg:mt-0 text-left font-bold">
          {t("register")}
        </span>
        <img
          className="object-cover rounded-full w-[300px] h-[300px] self-center"
          src={image ? image : image1}
          alt=""
        />
        <span className="font-semibold text-lg text-start">
          {t("haveAccount")}
          <a
            className="ml-2 hover:underline cursor-pointer text-customYellow"
            href={ROUTES.LOG_IN}
          >
            {t("login")}
          </a>
        </span>
      </div>
      <VerifyModal
        open={openVerifyModal}
        onClose={() => setOpenVerifyModal(false)}
        resolve={resolveVerifyModal}
      />
    </div>
  );
};

export default Register;
