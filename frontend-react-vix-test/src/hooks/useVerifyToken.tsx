import { useState } from "react";
import { useZUserProfile } from "../stores/useZUserProfile";
import { api } from "../services/api";
import { toast } from "react-toastify";

export const useVerifyToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, idUser } = useZUserProfile();

  const verifyPinCode = async (pinCode: string) => {
    if (!pinCode) return;
    const url = `/user/verify-pincode/${idUser}`;

    setIsLoading(true);
    const response = await api.post<{ token: string | null }>({
      url,
      data: { pinCode },
      tryRefetch: true,
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    if (!response.data || !response.data.token) return;
    setUser({ token: response.data.token });

    return response.data;
  };
  return { isLoading, verifyPinCode };
};
