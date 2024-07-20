import React, { useEffect, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Alert, Button, IconButton } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Products from "./Components/Products.tsx";
import { axiosI } from "../config/axios.ts";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../CustomLoader.tsx";
import { format } from "date-fns";
import { Product } from "../config/types.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/config.ts";
import ReportUserModal from "../User/models/ReportUser.tsx";
import ReportArticleModal from "../User/models/ReportArticle.tsx";
import { setReportedArticle } from "../Redux/slices/reportedArticle.ts";
import { setReportedUser } from "../Redux/slices/reportedUser.ts";
import { removeMyArticles } from "../Redux/slices/myArticles.ts";

const ArticleDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [operUser, setOpenUser] = useState<boolean>(false);
  const [openArticle, setOpenArticle] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);

        const { data } = await axiosI.get(`/products/${id}`);
        setProduct(data);
        dispatch(removeMyArticles());
      } catch (e) {
        setError(e?.response?.data || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, dispatch]);

  const formattedDate = product
    ? format(new Date(product.createdAt), "dd-MM-yyyy")
    : "";

  const handleOpenArticle = (articleId: string) => {
    dispatch(setReportedArticle(articleId));
    setOpenArticle(true);
  };

  const handleOpenUser = (userId: string) => {
    dispatch(setReportedUser(userId));
    setOpenUser(true);
  };

  return !!loading ? (
    <Loader />
  ) : (
    <div className="w-full h-full flex flex-col gap-16 text-customYellow">
      {!!error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
      {product && product.owner ? (
        <div className="w-full h-full flex flex-col gap-4 lg:flex-row-reverse">
          <div className="w-full lg:w-1/4 h-full flex flex-col p-3 border-2 gap-10 border-customYellow rounded-lg">
            <span className="text-center font-medium">{t("owner")}</span>
            <div className="w-full h-fit flex flex-row items-center justify-around">
              <img
                className="rounded-full w-16 h-16 lg:w-24 lg:h-24 border-2 border-customYellow"
                src={product.owner.image}
                alt=""
              />
              <span className="font-medium text-md">
                {product.owner.username}{" "}
                {product.owner.verification === true && <VerifiedIcon />}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-md">
                {t("firstName")}: <b>{product.owner.firstName}</b>
              </span>
              <span className="text-md">
                {t("lastName")}: <b>{product.owner.lastName}</b>
              </span>
              <b className="mt-2">{t("contact")}:</b>
              <span className="text-md">
                {t("email")}: <b>{product.owner.email}</b>
              </span>
              <span className="text-md">
                {t("phoneNumber")}: <b>{product.owner.phoneNumber}</b>
              </span>
              <span className="text-md mt-2">
                {t("role")}: <b>{product.owner.role}</b>
              </span>
              <b className="mt-2">{t("location")}:</b>
              <span className="text-md">
                {t("state1")}: <b>{product.owner.location.state}</b>
              </span>
              <span className="text-md">
                {t("city1")}: <b>{product.owner.location.city}</b>
              </span>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <IconButton
                onClick={() => handleOpenUser(product.owner._id)}
                color="error"
                className="!w-min"
              >
                <ReportProblemIcon />
              </IconButton>
              <Button
                onClick={() => navigate(`/user/${product.owner._id}`)}
                variant="contained"
                className="!bg-customYellow !text-black !font-semibold"
              >
                {t("details")}
              </Button>
            </div>
          </div>
          <div className="flex-grow flex flex-col border-2 gap-10 border-customYellow rounded-lg">
            <span className="font-semibold text-2xl text-center">
              {t("atricle")}
            </span>
            <div className="h-full w-full flex flex-col lg:flex-row gap-2">
              <div className="w-full lg:w-1/2 h-full flex flex-col p-3">
                <span className="text-lg font-semibold mb-2">
                  {product.name}
                </span>
                <img
                  className="w-[250px] h-[250px] border-2 border-customYellow rounded-lg box-border object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                  src={product.image}
                  alt=""
                />
                <span className="text-md font-medium mt-2">
                  {t("price")}: <b>{product.price}</b>
                </span>
                <span className="text-md font-medium ">
                  {t("quantity")}: <b>{product.quantity}</b>
                </span>
                <textarea
                  readOnly
                  value={product.description}
                  className="border-customYellow border-2 rounded-md p-2 bg-transparent text-customYellow h-[150px] overflow-auto mt-2"
                />
              </div>
              <div className="w-1/2 flex flex-col overflow-auto h-full gap-2">
                <span className="text-lg font-semibold">
                  {t("specifications")}:
                </span>
                <div className="gap-2 flex flex-col w-full my-4">
                  {Object.entries(product.specifications[0]).map(
                    (spec, index) => (
                      <span
                        key={index}
                        className={`flex flex-row justify-between items-center w-full p-1 ${
                          index % 2 === 0 ? "bg-[#242424]" : "bg-transparent"
                        }`}
                      >
                        <span>{spec[0]}</span>
                        <b>{spec[1]}</b>
                      </span>
                    )
                  )}
                </div>
                <Button
                  className="!w-min !whitespace-nowrap !bg-customYellow !text-black !font-semibold"
                  variant="contained"
                  endIcon={<CalendarMonthIcon />}
                  disabled
                >
                  {formattedDate}
                </Button>
                <Button
                  className="!w-min !whitespace-nowrap !bg-customYellow !text-black !font-semibold"
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  disabled
                >
                  {t("views")}: {product.views}
                </Button>
                <Button
                  onClick={() => handleOpenArticle(product._id)}
                  className="!mr-2"
                  variant="contained"
                  color="error"
                >
                  {t("report")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Alert variant="filled" severity="warning">
          {t("productNotFound")}
        </Alert>
      )}
      <span className="font-bold text-xl text-center border-b-2 border-customYellow">
        {t("otherArticles")}
      </span>
      <Products />
      <ReportUserModal open={operUser} onClose={() => setOpenUser(false)} />
      <ReportArticleModal
        open={openArticle}
        onClose={() => setOpenArticle(false)}
      />
    </div>
  );
};

export default ArticleDetails;
