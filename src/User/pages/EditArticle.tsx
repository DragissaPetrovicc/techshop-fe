import React, { useEffect, useState } from "react";
import { UserRoute } from "../../PrivateRoutes.tsx";
import { useTranslation } from "react-i18next";
import { CustomTextField } from "../../Guest/Components/customTextField.ts";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../CustomLoader.tsx";
import { axiosI, axiosT } from "../../config/axios.ts";
import { ROUTES } from "../../config/routes.ts";
import { Product } from "../../config/types.ts";

const EditArticle: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");

  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [specifications, setSpecifications] = useState<
    Array<{ id: number; spec: string; value: string }>
  >([{ id: 1, spec: "", value: "" }]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axiosI.get(`/products/${id}`);
        setProduct(data);
        setImage(data?.image);
        setName(data?.name);
        setQuantity(data?.quantity);
        setDescription(data?.description);
        setPrice(data?.price);
        setSpecifications(data?.specifications);
      } catch (error) {
        setError(error?.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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

  const editArticle = async () => {
    try {
      setLoading(true);

      const specificationsMap: { [key: string]: string } = {};
      specifications.forEach((spec) => {
        specificationsMap[spec.spec] = spec.value;
      });

      const requestData = {
        price,
        image,
        name,
        specifications: specificationsMap,
        description,
        quantity,
      };

      const { data } = await axiosT.patch(`/products/edit/${id}`, requestData);
      setRes(data);
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 1500);
    } catch (error) {
      setError(error?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const addSpecification = () => {
    setSpecifications([
      ...specifications,
      { id: specifications.length + 1, spec: "", value: "" },
    ]);
  };

  const handleSpecChange = (id: number, field: string, value: string) => {
    setSpecifications(
      specifications.map((spec) =>
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    );
  };

  return (
    <UserRoute>
      <div className="w-full h-full flex flex-col gap-10">
        <span className="text-customYellow font-semibold text-center text-xl lg:text-3xl">
          {t("edit")} {t("article")} <br /> {product?.name}
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

        <div className="w-full h-full flex flex-col lg:flex-row">
          <div className="w-1/2 h-full flex flex-col gap-3 p-2 lg:border-r-2 lg:border-customYellow overflow-auto">
            <CustomTextField
              label={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CustomTextField
              label={t("price")}
              value={price.toString()}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
            <CustomTextField
              label={t("quantity")}
              value={quantity.toString()}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            {image ? (
              <div className="w-[250px] h-[250px] box-border relative">
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
              value={description}
              placeholder={t("description")}
              className="border-customYellow border-2 rounded-md p-2 bg-transparent text-customYellow h-[150px]"
            />
          </div>
          <div className="w-1/2 h-full flex flex-col gap-3 p-2">
            <span className="text-lg text-customYellow font-semibold text-center">
              {t("specifications")}
            </span>

            <div className="flex flex-col justify-between gap-2">
              {!!product &&
                Object.entries(product.specifications[0]).map((spec, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center w-full gap-2"
                  >
                    <CustomTextField
                      label={t("specifications")}
                      value={spec[0]}
                      className="!w-full"
                    />
                    <CustomTextField
                      label={t("value")}
                      value={spec[1]}
                      className="!w-full"
                    />
                  </div>
                ))}

              {!!product &&
                specifications.map((spec) => (
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
              <Button
                onClick={addSpecification}
                variant="contained"
                className="!bg-customYellow !font-semibold !text-black !w-min !self-center !whitespace-nowrap"
              >
                {t("add")} {t("specifications")}
              </Button>
            </div>
          </div>
        </div>
        {!!loading ? (
          <Loader />
        ) : (
          <Button
            onClick={editArticle}
            variant="contained"
            className="!bg-customYellow !font-semibold !text-black !w-min !self-center !whitespace-nowrap"
          >
            {t("edit")}
          </Button>
        )}
      </div>
    </UserRoute>
  );
};

export default EditArticle;
