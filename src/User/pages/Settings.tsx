import { UserRoute } from "../../PrivateRoutes.tsx";
import { CustomTextFieldBlack } from "../../Guest/Components/customTextField.ts";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";
import { axiosI, axiosT } from "../../config/axios.ts";
import { setMyArticles } from "../../Redux/slices/myArticles.ts";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Button, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/config.ts";
import Loader from "../../CustomLoader.tsx";
import { ROUTES } from "../../config/routes.ts";
import { removeCredentials } from "../../Redux/slices/loggedUser.ts";
import DeleteIcon from "@mui/icons-material/Delete";

const Settings: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const id = useSelector((state: RootState) => state.loggedUser.items.id);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [res, setRes] = useState<string>("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get(`/user/${id}`);
        setImage(data?.image);
        setUsername(data?.username);
        setEmail(data?.email);
        const usersArticles = async () => {
          try {
            setLoading(true);

            const { data } = await axiosI.get(`/products/user/${id}`);

            dispatch(setMyArticles(data));
          } catch (e) {
            setError(e?.response?.data || "Something went wrong");
          } finally {
            setLoading(false);
          }
        };
        usersArticles();
      } catch (e) {
        setError(e?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, dispatch]);

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

  const patchUser = async () => {
    try {
      setLoading(true);
      const { data } = await axiosT.patch(`/user/${id}`, {
        email,
        username,
        password,
        image,
      });
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

  const deleteUser = async () => {
    try {
      setLoading(true);
      const { data } = await axiosT.delete(`/user/${id}`);
      setRes(data);

      dispatch(removeCredentials());
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      setTimeout(() => {
        navigate(ROUTES.LOG_IN);
      }, 1500);
    } catch (e) {
      setError(e?.response?.data || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <div className="w-full h-full flex justify-center items-center ">
        <div className="border-4 border-black rounded-xl justify-center flex flex-col w-full h-full bg-customYellow lg:w-1/2 text-black p-2 lg:p-6 gap-3">
          <span className="font-bold text-xl lg:text-3xl text-center">
            {t("settings")}
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

          <CustomTextFieldBlack
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label={t("username")}
            className="!w-full"
          />
          <CustomTextFieldBlack
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label={t("email")}
            className="!w-full"
          />
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
          {image ? (
            <div className="w-[100px] h-[100px] relative">
              <img
                className="w-full h-full rounded-full border-2 border-customYellow"
                src={image}
                alt=""
              />
              <IconButton
                className="absolute bottom-28 left-20 bg-white bg-opacity-75"
                onClick={() => setImage(null)}
              >
                <CloseIcon className="!text-red-500" />
              </IconButton>
            </div>
          ) : (
            <Button
              className="!bg-black !text-customYellow !font-semibold !w-min !whitespace-nowrap"
              component="label"
              variant="contained"
              endIcon={<CloudUploadIcon />}
            >
              {t("choseImage")}
              <VisuallyHiddenInput type="file" onChange={imgUpload} />
            </Button>
          )}

          <Button
            onClick={deleteUser}
            endIcon={<DeleteIcon />}
            variant="contained"
            color="error"
            className="!self-center !w-min !whitespace-nowrap"
          >
            {t("delete")}
          </Button>

          <div className="flex flex-row-reverse justify-around items-center w-full">
            <Button
              onClick={patchUser}
              variant="contained"
              className="!bg-black !text-customYellow !font-semibold "
            >
              {!!loading ? <Loader /> : t("submit")}
            </Button>
            <Button
              onClick={() => navigate(ROUTES.HOME)}
              endIcon={<HomeIcon />}
              variant="contained"
              className="!bg-black !text-customYellow !w-min !self-center !whitespace-nowrap !font-semibold"
            >
              {t("home")}
            </Button>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Settings;
