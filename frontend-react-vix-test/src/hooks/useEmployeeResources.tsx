import { useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { IListAll } from "../types/ListAllTypes";
import { useZUserProfile } from "../stores/useZUserProfile";
import { useTranslation } from "react-i18next";
import {
  IUserResponse,
  ICreateEmployee,
  IUpdateEmployee,
} from "../types/userTypes";

interface IListEmployeesParams {
  idBrandMaster?: number | null;
  search?: string;
  isActive?: boolean;
}

export const useEmployeeResources = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAuth } = useAuth();
  const { role } = useZUserProfile();
  const { t } = useTranslation();

  const listAllEmployees = async (params?: IListEmployeesParams) => {
    const auth = await getAuth();
    setIsLoading(true);

    const queryParams: Record<string, string | number | boolean | undefined> =
      {};

    if (params?.idBrandMaster) {
      queryParams.idBrandMaster = params.idBrandMaster;
    }
    if (params?.search) {
      queryParams.search = params.search;
    }
    if (params?.isActive !== undefined) {
      queryParams.isActive = params.isActive;
    }

    const response = await api.get<IListAll<IUserResponse>>({
      url: "/user",
      auth,
      params: queryParams,
    });

    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
      return {
        totalCount: 0,
        result: [],
      };
    }

    return response.data;
  };

  const createEmployee = async (data: ICreateEmployee) => {
    if (!data) return null;

    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return null;
    }

    const auth = await getAuth();
    setIsLoading(true);

    const response = await api.post<IUserResponse>({
      url: "/user",
      auth,
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        fullName: data.fullName,
        userPhoneNumber: data.userPhoneNumber || null,
        role: data.role,
        idBrandMaster: data.idBrandMaster,
        isActive: data.isActive,
        field: data.field || null,
        department: data.department || null,
        contractDate: data.contractDate || null,
      },
    });

    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
      return null;
    }

    return response.data;
  };

  const updateEmployee = async (idUser: string, data: IUpdateEmployee) => {
    if (!idUser || !data) return null;

    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return null;
    }

    const auth = await getAuth();
    setIsLoading(true);

    const updateData: Record<string, unknown> = {};

    if (data.username) updateData.username = data.username;
    if (data.password) updateData.password = data.password;
    if (data.email) updateData.email = data.email;
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.userPhoneNumber !== undefined)
      updateData.userPhoneNumber = data.userPhoneNumber || null;
    if (data.role) updateData.role = data.role;
    if (data.idBrandMaster !== undefined)
      updateData.idBrandMaster = data.idBrandMaster;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.field !== undefined) updateData.field = data.field || null;
    if (data.department !== undefined)
      updateData.department = data.department || null;
    if (data.contractDate !== undefined)
      updateData.contractDate = data.contractDate || null;

    const response = await api.put<IUserResponse>({
      url: `/user/${idUser}`,
      auth,
      data: updateData,
    });

    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
      return null;
    }

    return response.data;
  };

  const deleteEmployee = async (idUser: string) => {
    if (!idUser) return null;

    if (role !== "admin") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return null;
    }

    const auth = await getAuth();
    setIsLoading(true);

    const response = await api.delete<{ message: string }>({
      url: `/user/${idUser}`,
      auth,
    });

    setIsLoading(false);

    if (response.error) {
      toast.error(response.message);
      return null;
    }

    return response.data;
  };

  return {
    isLoading,
    listAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
