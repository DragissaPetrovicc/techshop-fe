import React from "react";
import { ROUTES } from "./config/routes.ts";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { PrivateRouteProps } from "./config/types.ts";

export const UserRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  return !!token ? (
    <>{children}</>
  ) : (
    <Alert
      variant="filled"
      severity="error"
      action={
        <Button
          onClick={() => navigate(ROUTES.LOG_IN)}
          color="inherit"
          size="small"
        >
          {t("continue")}
        </Button>
      }
    >
      Access denied. You have to log in
    </Alert>
  );
};

export const AdminRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const { t } = useTranslation();

  return !!token && role === "ADMIN" ? (
    <>{children}</>
  ) : (
    <Alert
      variant="filled"
      severity="error"
      action={
        <Button
          onClick={() => navigate(ROUTES.HOME)}
          color="inherit"
          size="small"
        >
          {t("continue")}
        </Button>
      }
    >
      Access denied. Only administrators are allowed
    </Alert>
  );
};
