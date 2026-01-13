import { create } from "zustand";
import { IUserResponse } from "../types/userTypes";
import { INewMSPResponse } from "../hooks/useBrandMasterResources";

interface IColaboratorRegisterPage {
  fullName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  position: string;
  department: string;
  userPermission: "admin" | "manager" | "member";
  status: boolean;
  companyId: number | null;
  companyName: string;
  hiringDate: string;
  showError: boolean;
  employeeList: IUserResponse[];
  isEditing: string[];
  modalOpen: null | "created" | "edited" | "deleted";
  employeeToBeDeleted: IUserResponse | null;
  companyFilter: number | null;
  companyFilterText: string;
  userFilter: string;
  enterOnEditing: boolean;
  companyOptions: INewMSPResponse[];
  profileImgUrl: string;
}

const INIT_STATE: IColaboratorRegisterPage = {
  fullName: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  confirmPassword: "",
  position: "",
  department: "",
  userPermission: "member",
  status: true,
  companyId: null,
  companyName: "",
  hiringDate: "",
  showError: false,
  employeeList: [],
  isEditing: [],
  modalOpen: null,
  employeeToBeDeleted: null,
  companyFilter: null,
  companyFilterText: "",
  userFilter: "",
  enterOnEditing: false,
  companyOptions: [],
  profileImgUrl: "",
};

const {
  employeeList: _employeeList,
  isEditing: _isEditing,
  companyOptions: _companyOptions,
  ...resetState
} = INIT_STATE;
void _employeeList;
void _isEditing;
void _companyOptions;

interface IColaboratorRegisterPageState extends IColaboratorRegisterPage {
  setFullName: (fullName: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setPosition: (position: string) => void;
  setDepartment: (department: string) => void;
  setUserPermission: (userPermission: "admin" | "manager" | "member") => void;
  setStatus: (status: boolean) => void;
  setCompanyId: (companyId: number | null) => void;
  setCompanyName: (companyName: string) => void;
  setHiringDate: (hiringDate: string) => void;
  setShowError: (showError: boolean) => void;
  setEmployeeList: (employeeList: IUserResponse[]) => void;
  setIsEditing: (isEditing: string[]) => void;
  setModalOpen: (modalOpen: null | "created" | "edited" | "deleted") => void;
  setEmployeeToBeDeleted: (employee: IUserResponse | null) => void;
  setCompanyFilter: (companyFilter: number | null) => void;
  setCompanyFilterText: (companyFilterText: string) => void;
  setUserFilter: (userFilter: string) => void;
  setEnterOnEditing: (enterOnEditing: boolean) => void;
  setCompanyOptions: (companyOptions: INewMSPResponse[]) => void;
  setProfileImgUrl: (profileImgUrl: string) => void;
  resetAll: () => void;
}

export const useZColaboratorRegisterPage =
  create<IColaboratorRegisterPageState>((set) => ({
    ...INIT_STATE,
    setFullName: (fullName: string) => set((state) => ({ ...state, fullName })),
    setEmail: (email: string) => set((state) => ({ ...state, email })),
    setPhone: (phone: string) => set((state) => ({ ...state, phone })),
    setUsername: (username: string) => set((state) => ({ ...state, username })),
    setPassword: (password: string) => set((state) => ({ ...state, password })),
    setConfirmPassword: (confirmPassword: string) =>
      set((state) => ({ ...state, confirmPassword })),
    setPosition: (position: string) => set((state) => ({ ...state, position })),
    setDepartment: (department: string) =>
      set((state) => ({ ...state, department })),
    setUserPermission: (userPermission: "admin" | "manager" | "member") =>
      set((state) => ({ ...state, userPermission })),
    setStatus: (status: boolean) => set((state) => ({ ...state, status })),
    setCompanyId: (companyId: number | null) =>
      set((state) => ({ ...state, companyId })),
    setCompanyName: (companyName: string) =>
      set((state) => ({ ...state, companyName })),
    setHiringDate: (hiringDate: string) =>
      set((state) => ({ ...state, hiringDate })),
    setShowError: (showError: boolean) =>
      set((state) => ({ ...state, showError })),
    setEmployeeList: (employeeList: IUserResponse[]) =>
      set((state) => ({ ...state, employeeList: [...employeeList] })),
    setIsEditing: (isEditing: string[]) =>
      set((state) => ({ ...state, isEditing: [...isEditing] })),
    setModalOpen: (modalOpen: null | "created" | "edited" | "deleted") =>
      set((state) => ({ ...state, modalOpen })),
    setEmployeeToBeDeleted: (employeeToBeDeleted: IUserResponse | null) =>
      set((state) => ({ ...state, employeeToBeDeleted })),
    setCompanyFilter: (companyFilter: number | null) =>
      set((state) => ({ ...state, companyFilter })),
    setCompanyFilterText: (companyFilterText: string) =>
      set((state) => ({ ...state, companyFilterText })),
    setUserFilter: (userFilter: string) =>
      set((state) => ({ ...state, userFilter })),
    setEnterOnEditing: (enterOnEditing: boolean) =>
      set((state) => ({ ...state, enterOnEditing })),
    setCompanyOptions: (companyOptions: INewMSPResponse[]) =>
      set((state) => ({ ...state, companyOptions: [...companyOptions] })),
    setProfileImgUrl: (profileImgUrl: string) =>
      set((state) => ({ ...state, profileImgUrl })),
    resetAll: () => set((state) => ({ ...state, ...resetState })),
  }));
