import React, { useState } from "react";
import { UserRoute } from "../../PrivateRoutes.tsx";
import { useTranslation } from "react-i18next";
import { CustomTextField } from "../../Guest/Components/customTextField.ts";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/config.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/config.ts";
import { removeMyArticles } from "../../Redux/slices/myArticles.ts";

const AddArticle: React.FC = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const [specifications, setSpecifications] = useState<
    Array<{ id: number; spec: string; value: string }>
  >([{ id: 1, spec: "", value: "" }]);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const addSpecification = () => {
    const allFieldsFilled = specifications.every(
      (spec) => spec.spec.length >= 3 && spec.value.length >= 3
    );
    if (allFieldsFilled) {
      setSpecifications([
        ...specifications,
        { id: specifications.length + 1, spec: "", value: "" },
      ]);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleSpecChange = (id: number, field: string, value: string) => {
    setSpecifications(
      specifications.map((spec) =>
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    );
  };

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

  const owner = useSelector((state: RootState) => state.loggedUser.items.id);
  const role = localStorage.getItem("role");

  const addProduct = async () => {
    try {
      setLoading(true);

      const specificationsMap: { [key: string]: string } = {};
      specifications.forEach((spec) => {
        specificationsMap[spec.spec] = spec.value;
      });

      const requestData = {
        owner,
        price,
        image,
        name,
        specifications: specificationsMap,
        description,
        quantity,
      };

      const { data } = await axiosT.post("/products/add", requestData);

      setResponse(data);
      dispatch(removeMyArticles());
      setTimeout(() => {
        if (role === "USER") {
          navigate(ROUTES.HOME);
        } else {
          navigate(ROUTES.ADMIN_HOME);
        }
      }, 1500);
    } catch (e) {
      console.error("Error:", e);
      setError(e?.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      <div className="w-full h-full flex flex-col gap-10">
        <span className="text-customYellow text-xl md:text-3xl text-center font-semibold">
          {t("addArticle")}
        </span>

        <div className="w-full h-full flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 h-full flex flex-col gap-3 p-2 lg:border-r-2 lg:border-customYellow overflow-auto">
            {!!error && (
              <Alert variant="filled" severity="error">
                {error}
              </Alert>
            )}
            {!!response && (
              <Alert variant="filled" severity="success">
                {response}
              </Alert>
            )}
            <CustomTextField
              label={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CustomTextField
              label={t("price")}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <CustomTextField
              label={t("quantity")}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {image ? (
              <div className="w-[250px] h-[250px] relative">
                <img
                  className="w-[250px] h-[250px] box-border rounded-md border-2 border-customYellow"
                  src={image}
                  alt=""
                />
                <IconButton
                  className="absolute bottom-64 left-52 bg-white bg-opacity-75"
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
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description ? description : t("description")}
              className="border-customYellow border-2 rounded-md p-2 bg-transparent text-customYellow h-[150px]"
            />
          </div>
          <div className="w-full lg:w-1/2 h-full flex flex-col gap-3 p-2">
            <span className="text-lg text-customYellow font-semibold text-center">
              {t("specifications")}
            </span>

            {specifications.map((spec) => (
              <div
                key={spec.id}
                className="flex flex-row justify-between gap-2"
              >
                <CustomTextField
                  className="!w-full"
                  label={t("specifications")}
                  value={spec.spec}
                  onChange={(e) =>
                    handleSpecChange(spec.id, "spec", e.target.value)
                  }
                />
                <CustomTextField
                  className="!w-full"
                  label={t("value")}
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecChange(spec.id, "value", e.target.value)
                  }
                />
              </div>
            ))}
            {showAlert && (
              <Alert severity="warning">{t("alertFillFields")}</Alert>
            )}
            <Button
              onClick={addSpecification}
              variant="contained"
              className="!bg-customYellow !font-semibold !text-black !w-min !self-center !whitespace-nowrap"
            >
              {t("add")} {t("specifications")}
            </Button>
          </div>
        </div>
        <Button
          onClick={addProduct}
          variant="contained"
          className="!bg-customYellow !font-semibold !text-black !w-min !self-center "
        >
          {!!loading ? <Loader /> : t("add")}
        </Button>
      </div>
    </UserRoute>
  );
};

export default AddArticle;
