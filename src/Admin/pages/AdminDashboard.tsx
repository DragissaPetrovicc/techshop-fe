import React, { useEffect, useState } from "react";
import { AdminRoute } from "../../PrivateRoutes.tsx";
import { Alert, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import GroupIcon from "@mui/icons-material/Group";
import ReportIcon from "@mui/icons-material/Report";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import AllUsers from "../components/AllUsers.tsx";
import UserReps from "../components/UserReps.tsx";
import ArticleReps from "../components/ArticleReps.tsx";
import SendNotificationModal from "../models/SendNotificationModal.tsx";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import { formatDate } from "date-fns";

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openSendN, setOpenSendN] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [ratings, setRatings] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get("/admin/allRatings");
        setRatings(data);
      } catch (e) {
        setError(e?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminRoute>
      <div className="w-full h-full flex flex-col gap-12 text-customYellow">
        <div className="flex flex-row w-full items-center justify-between">
          <b className="text-center text-xl md:text-3xl">
            {t("admin")} {t("dashboard")}
          </b>
          <Button
            onClick={() => navigate(ROUTES.ADMIN_HOME)}
            className="!bg-customYellow !text-black !w-mini !whitespace-nowrap !font-semibold"
          >
            {t("admin")} {t("home")}
          </Button>
        </div>
        {!!error && (
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        )}
        {!!loading && <Loader />}
        <div className="mt-4">
          {value === 0 && <AllUsers />}
          {value === 1 && <UserReps />}
          {value === 2 && <ArticleReps />}
        </div>
        <BottomNavigation
          className="!bg-transparent"
          showLabels
          value={value}
          onChange={(e, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            className="!text-customYellow"
            label={t("allUsers")}
            icon={<GroupIcon />}
          />
          <BottomNavigationAction
            className="!text-customYellow"
            label={t("userReps")}
            icon={<ReportProblemIcon />}
          />
          <BottomNavigationAction
            className="!text-customYellow"
            label={t("articleReps")}
            icon={<ReportIcon />}
          />
        </BottomNavigation>

        <div className="h-min w-max flex flex-row md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 text-black ">
          {ratings.length > 0 &&
            ratings.map((r: any) => {
              const formattedDate = formatDate(r.ratedAt, "dd-mm-yyyy");
              return (
                <div
                  key={r._id}
                  className="w-max h-max flex flex-col gap-7 p-5 border-2 border-black bg-customYellow rounded"
                >
                  <span>
                    {t("user")}: <b>{r.ratedBy.username}</b>
                  </span>
                  <b>
                    {t("rated")} {r.stars}
                    <StarIcon className="!text-customYellow !text-2xl" />
                  </b>
                  {formattedDate}
                </div>
              );
            })}
        </div>

        <Button
          onClick={() => setOpenSendN(true)}
          variant="contained"
          endIcon={<SendIcon />}
          className="!bg-customYellow !text-black !w-mini !whitespace-nowrap !font-semibold !self-end"
        >
          {t("sendNotification")}
        </Button>
      </div>
      <SendNotificationModal
        open={openSendN}
        onClose={() => setOpenSendN(false)}
      />
    </AdminRoute>
  );
};

export default AdminDashboard;
