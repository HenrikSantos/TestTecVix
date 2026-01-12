import { useNavigate } from "react-router-dom";
import { useZResetAllStates } from "../stores/useZResetAllStates";
import { useZUserProfile } from "../stores/useZUserProfile";
import { FullPage } from "../components/Skeletons/FullPage";
import { useEffect, useState } from "react";

interface IProps {
  children: React.ReactNode;
  onlyManagerOrAdmin?: boolean;
  onlyAdmin?: boolean;
  onlyInternal?: boolean;
  skeleton?: boolean;
}

export const PrivatePage = ({
  children,
  onlyAdmin = false,
  onlyManagerOrAdmin = false,
  onlyInternal = false,
}: IProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const { resetAllStates } = useZResetAllStates();
  const { token, role, idBrand } = useZUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      resetAllStates();
      navigate("/login");
      return;
    }

    if (onlyAdmin && role !== "admin") {
      navigate(-1);
      return;
    }

    if (onlyManagerOrAdmin && role !== "admin" && role !== "manager") {
      navigate(-1);
      return;
    }

    if (onlyInternal && idBrand !== null) {
      navigate(-1);
      return;
    }

    setIsChecking(false);
  }, [
    token,
    role,
    idBrand,
    onlyAdmin,
    onlyManagerOrAdmin,
    onlyInternal,
    navigate,
    resetAllStates,
  ]);

  if (!token) {
    return <FullPage />;
  }

  if (isChecking) {
    return <FullPage />;
  }

  return <>{children}</>;
};
