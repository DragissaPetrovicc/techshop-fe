import { Alert, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "../../CustomLoader.tsx";
import { axiosT } from "../../config/axios.ts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes.ts";

const AllUsers: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [res, setRes] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosT.get("/admin/allUsers");
        setUsers(data);
      } catch (e) {
        setError(e?.response?.data || "An error occured");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ban = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axiosT.delete(`/user/${id}`);
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

  const setAsAdmin = async (id: string) => {
    try {
      setLoading(true);
      const { data } = await axiosT.patch(`/admin/setAsAdmin/${id}`);
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

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 text-black">
      <b className="text-center text-xl md:text-3xl text-customYellow">
        {t("allUsers")}
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
          {users.length > 0 &&
            users.map((u) => (
              <div
                key={u._id}
                className="w-full h-fit p-2 grid grid-cols-2 grid-rows-2 gap-2 border-2 border-black"
              >
                <span className="font-medium text-lg">
                  ID: <b>{u._id}</b>
                </span>
                <Button
                  onClick={() => setAsAdmin(u._id)}
                  variant="contained"
                  color="primary"
                >
                  {u.role === "USER" ? t("setAsAdmin") : t("setAsUser")}
                </Button>
                <span className="font-medium text-lg">
                  {t("username")}: <b>{u.username}</b>
                </span>
                <Button
                  onClick={() => ban(u._id)}
                  variant="contained"
                  color="error"
                >
                  Ban
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
