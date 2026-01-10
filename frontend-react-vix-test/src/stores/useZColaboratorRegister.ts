import { create } from "zustand";
import { IBrandMasterBasicInfo } from "../types/BrandMasterTypes";

export type Colaborator = {
  idUser: number;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  permission: "admin" | "manager" | "member";
  hiringDate?: string | Date | null;
  status: "active" | "inactive";
  lastActivity: string | Date | null;
  profileImgUrl?: string | null;
  idBrandMaster?: number;
};

export interface ColaboratorRegisterInputs {
  idUser?: number | null;
  colaboratorName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  permission: string;
  hiringDate: string;
  status: string;
  errorMessage: boolean;
  idBrandMaster?: number;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const INPUTS_INITIAL_STATE: ColaboratorRegisterInputs = {
  idUser: null,
  colaboratorName: "",
  email: "",
  phone: "",
  position: "",
  department: "",
  permission: "",
  hiringDate: "",
  status: "",
  errorMessage: false,
  idBrandMaster: 0,
  username: "",
  password: "",
  confirmPassword: "",
};

type editingInfos = {
  index: number;
  permission: "admin" | "manager" | "member";
  status: "active" | "inactive";
};

interface IColaboratorRegister extends ColaboratorRegisterInputs {
  users: Colaborator[];
  isEditing: number[];
  editInfos: editingInfos[];
  colaboratorNameFilter: string;
  companyNameFilter: string;
  currentTabIndex: number;
  search: string;
  page: number;
  limit: number;
  totalPage: number;
  selectedMSP: IBrandMasterBasicInfo | null;
}

const INITIAL_STATE: IColaboratorRegister = {
  ...INPUTS_INITIAL_STATE,
  users: [],
  isEditing: [],
  editInfos: [],
  colaboratorNameFilter: "",
  companyNameFilter: "",
  currentTabIndex: 0,
  search: "",
  page: 1,
  limit: 5,
  totalPage: 0,
  selectedMSP: null,
};

interface IColaboratorRegisterState extends IColaboratorRegister {
  resetInputs: () => void;
  setIdUser: (id: number) => void;
  setColaboratorName: (colaboratorName: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setPosition: (position: string) => void;
  setDepartment: (department: string) => void;
  setPermission: (permission: string) => void;
  setHiringDate: (hiringDate: string) => void;
  setStatus: (status: string) => void;
  setUsers: (users: Colaborator[]) => void;
  setIsEditing: (index: number[]) => void;
  setEditInfos: (editingInfos: editingInfos[]) => void;
  setColaboratorNameFilter: (colaboratorNameFilter: string) => void;
  setCompanyNameFilter: (companyNameFilter: string) => void;
  setErrorMessage: (errorMessage: boolean) => void;
  setIdBrandMaster: (idBrandMaster: number) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setCurrentTabIndex: (currentTabIndex: number) => void;
  resetAll: () => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setTotalPage: (totalPage: number) => void;
  setSelectedMSP: (selectedMSP: IBrandMasterBasicInfo | null) => void;
}

export const useZColaboratorRegister = create<IColaboratorRegisterState>(
  (set) => ({
    ...INITIAL_STATE,
    resetInputs: () => set((state) => ({ ...state, ...INPUTS_INITIAL_STATE })),
    setColaboratorName: (colaboratorName: string) =>
      set((state) => ({ ...state, colaboratorName })),
    setEmail: (email: string) => set((state) => ({ ...state, email })),
    setPhone: (phone: string) => set((state) => ({ ...state, phone })),
    setPosition: (position: string) => set((state) => ({ ...state, position })),
    setDepartment: (department: string) =>
      set((state) => ({ ...state, department })),
    setPermission: (permission: string) =>
      set((state) => ({ ...state, permission })),
    setHiringDate: (hiringDate: string) =>
      set((state) => ({ ...state, hiringDate })),
    setStatus: (status: string) => set((state) => ({ ...state, status })),
    setUsers: (users: Colaborator[]) => set((state) => ({ ...state, users })),
    setIsEditing: (newEditing: number[]) =>
      set((state) => ({ ...state, isEditing: [...newEditing] })),
    setEditInfos: (editingInfos: editingInfos[]) =>
      set((state) => ({ ...state, editInfos: [...editingInfos] })),
    setColaboratorNameFilter: (colaboratorNameFilter: string) =>
      set((state) => ({ ...state, colaboratorNameFilter })),
    setCompanyNameFilter: (companyNameFilter: string) =>
      set((state) => ({ ...state, companyNameFilter })),
    setIdUser: (id: number) => set((state) => ({ ...state, idUser: id })),
    setErrorMessage: (errorMessage: boolean) =>
      set((state) => ({ ...state, errorMessage })),
    setIdBrandMaster: (idBrandMaster: number) =>
      set((state) => ({ ...state, idBrandMaster: idBrandMaster })),
    setUsername: (username: string) =>
      set((state) => ({ ...state, username: username })),
    setPassword: (password: string) =>
      set((state) => ({ ...state, password: password })),
    setConfirmPassword: (confirmPassword: string) =>
      set((state) => ({ ...state, confirmPassword: confirmPassword })),
    setCurrentTabIndex: (currentTabIndex: number) =>
      set((state) => ({ ...state, currentTabIndex: currentTabIndex })),
    setPage: (page: number) => set((state) => ({ ...state, page: page })),
    setSearch: (search: string) =>
      set((state) => ({ ...state, search: search })),
    setTotalPage: (totalPage: number) =>
      set((state) => ({ ...state, totalPage: totalPage })),
    setSelectedMSP: (selectedMSP: IBrandMasterBasicInfo | null) =>
      set((state) => ({ ...state, selectedMSP: selectedMSP })),

    resetAll: () => set((state) => ({ ...state, ...INITIAL_STATE })),
  }),
);
