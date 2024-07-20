import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import UserRepsModal from "../models/UserRepsModal.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";
import { format } from "date-fns";

const UserReps: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [reps, setReps] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [res, setRes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get("/admin/reports/user");
        setReps(data);
      } catch (e) {
        setError(e?.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const deleteUserRep = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axiosT.delete(`/admin/delete/userRep/${id}`);
      setRes(data);

      setTimeout(() => {
        navigate(ROUTES.ADMIN_HOME);
      }, 1200);
    } catch (e) {
      setError(e?.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 text-black">
      <b className="text-center text-xl md:text-3xl text-customYellow">
        {t("userReps")}
      </b>

      {!!res && (
        <Alert severity="success" variant="filled">
          {res}
        </Alert>
      )}

      {!!loading && <Loader />}

      {!!error ? (
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      ) : (
        <div className="w-full lg:w-1/2 h-full flex flex-col border-4 border-black bg-customYellow rounded-xl p-3 gap-4 overflow-auto">
          {reps.length > 0 &&
            reps.map((r) => (
              <div
                key={r._id}
                className="w-full h-fit p-2 grid grid-cols-2 grid-rows-2 gap-2 border-2 border-black"
              >
                <span
                  onClick={() => setOpen(true)}
                  className="font-medium text-lg cursor-pointer"
                >
                  {t("report")}: <b>{r.reportedBy?.username || "N/A"}</b>
                </span>
                <Button
                  className="!bg-gray-900 !text-customYellow"
                  endIcon={<CalendarMonthIcon />}
                  variant="contained"
                  disabled
                >
                  {format(new Date(r.createdAt), "dd-MM-yyyy")}
                </Button>
                <span
                  onClick={() => setOpen(true)}
                  className="font-medium text-lg cursor-pointer"
                >
                  {" "}
                  {t("reporedtUser")}:{" "}
                  <b>{r.reportedUser?.username || "N/A"}</b>
                </span>
                <Button
                  onClick={() => deleteUserRep(r._id)}
                  variant="contained"
                  color="error"
                >
                  {t("delete")}
                </Button>
                <UserRepsModal
                  open={open}
                  onClose={() => setOpen(false)}
                  id={r._id}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserReps;
