import { useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";
import { useZGlobalVar } from "../stores/useZGlobalVar";
import { useZUserProfile } from "../stores/useZUserProfile";
import { useZBrandInfo } from "../stores/useZBrandStore";
import { useNavigate } from "react-router-dom";
import { useZResetAllStates } from "../stores/useZResetAllStates";

interface IUserLoginResponse {
  token: string | null;
  user: {
    createdAt: string | Date;
    deletedAt: string | Date | null;
    email: string;
    fullName: string | null;
    idBrandMaster: number | null;
    idUser: number;
    isActive: boolean;
    profileImgUrl: null | string;
    role: "admin" | "manager" | "member";
    updatedAt: string | Date;
    username: string;
    userPhoneNumber: string | null;
  };
  brandMaster: {
    emailContact: string | null;
    smsContact: string | null;
    timezone: string | null;
  } | null;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setIsOpenModalUserNotActive, setLoginTime } = useZGlobalVar();
  const { setUser } = useZUserProfile();
  const { setBrandInfo } = useZBrandInfo();
  const { resetAllStates } = useZResetAllStates();
  const navigate = useNavigate();

  const goLogin = async ({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email: string;
  }) => {
    setIsLoading(true);
    if ((!username && !email) || !password) {
      setIsLoading(false);
      return;
    }

    const response = await api.post<IUserLoginResponse>({
      url: "/user/login",
      data: {
        username: username || undefined,
        password,
        email: email || undefined,
      },
      tryRefetch: true,
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    if (!response.data.user?.isActive) {
      setIsOpenModalUserNotActive(true);
      return;
    }

    setUser({
      idUser: response.data.user.idUser,
      profileImgUrl: response.data.user.profileImgUrl,
      imageUrl: response.data.user.profileImgUrl || "",
      username: response.data.user.username,
      userEmail: response.data.user.email,
      fullName: response.data.user.fullName,
      idBrand: response.data.user.idBrandMaster,
      token: response.data.token,
      role: response.data.user.role,
      userPhoneNumber: response.data.user.userPhoneNumber,
    });

    if (response.data.brandMaster) {
      setBrandInfo({
        emailContact: response.data.brandMaster.emailContact || "",
        smsContact: response.data.brandMaster.smsContact || "",
        timezone: response.data.brandMaster.timezone || "",
      });
    } else {
      setBrandInfo({
        emailContact: "",
        smsContact: "",
        timezone: "",
      });
    }

    setLoginTime(new Date());
    navigate("/");
  };

  const goLogout = () => {
    resetAllStates();
    return navigate("/login");
  };

  return { goLogin, isLoading, goLogout };
};
