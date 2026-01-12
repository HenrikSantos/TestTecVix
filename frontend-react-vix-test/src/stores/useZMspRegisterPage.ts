import { create } from "zustand";
import { INewMSPResponse } from "../hooks/useBrandMasterResources";
import { IBrandMasterBasicInfo } from "../types/BrandMasterTypes";
import { IVMCreatedResponse } from "../types/VMTypes";

interface IMspRegisterPage {
  activeStep: 0 | 1;
  companyName: string;
  cnpj: string;
  phone: string;
  sector: string;
  contactEmail: string;
  cep: string;
  location: string;
  locality: string;
  countryState: string;
  city: string;
  street: string;
  streetNumber: string;
  admName: string;
  admEmail: string;
  admPhone: string;
  position: string;
  admPassword: string;
  showError: boolean;
  showErrorPageTwo: boolean;
  mspDomain: string;
  mspList: INewMSPResponse[];
  isEditing: number[];
  modalOpen: null | "editedMsp" | "createdMsp" | "deletedMsp";
  mspToBeDeleted?: INewMSPResponse | null;
  mspTableFilter: string;
  brandLogoUrl: string;
  brandObjectName: string;
  cityCode: string;
  district: string;
  alertMessage: string | null;
  enterOnEditing: boolean;
  showCnpjError: boolean;
  showCepError: boolean;
  showAddressFields: boolean;
  isPoc: boolean;
  isPocFilter: boolean;
  discountRate: number;
  minConsumption: number;
  brandMasterDeleted: IBrandMasterBasicInfo | null;
  vmsToBeDeleted: IVMCreatedResponse[];
  notesBrandMasterDescription: string;
}

const INIT_STATE: IMspRegisterPage = {
  activeStep: 0,
  companyName: "",
  cnpj: "",
  phone: "",
  sector: "",
  contactEmail: "",
  cep: "",
  location: "",
  locality: "",
  countryState: "",
  city: "",
  street: "",
  streetNumber: "",
  admName: "",
  admEmail: "",
  admPhone: "",
  position: "admin",
  admPassword: "",
  showError: false,
  mspDomain: "",
  showErrorPageTwo: false,
  mspList: [],
  isEditing: [],
  modalOpen: null,
  mspToBeDeleted: null,
  mspTableFilter: "",
  brandLogoUrl: "",
  brandObjectName: "",
  cityCode: "",
  district: "",
  alertMessage: null,
  enterOnEditing: false,
  showCnpjError: false,
  showCepError: false,
  showAddressFields: false,
  isPoc: false,
  isPocFilter: false,
  discountRate: 0,
  minConsumption: 0,
  brandMasterDeleted: null,
  vmsToBeDeleted: [],
  notesBrandMasterDescription: "",
};

const {
  activeStep: _activeStep,
  mspList: _mspList,
  isEditing: _isEditing,
  ...resetState
} = INIT_STATE;
void _activeStep;
void _mspList;
void _isEditing;

interface IMspRegisterPageState extends IMspRegisterPage {
  setActiveStep: (activeStep: 0 | 1) => void;
  setCompanyName: (companyName: string) => void;
  setCnpj: (cnpj: string) => void;
  setPhone: (phone: string) => void;
  setSector: (sector: string) => void;
  setContactEmail: (contactEmail: string) => void;
  setCep: (cep: string) => void;
  setLocation: (location: string) => void;
  setLocality: (locality: string) => void;
  setCountryState: (state: string) => void;
  setCity: (city: string) => void;
  setStreet: (street: string) => void;
  setStreetNumber: (streetNumber: string) => void;
  setAdmName: (admName: string) => void;
  setAdmEmail: (admEmail: string) => void;
  setAdmPhone: (admPhone: string) => void;
  setPosition: (position: string) => void;
  setMSPDomain: (domain: string) => void;
  setAdmPassword: (admPassword: string) => void;
  setShowError: (showError: boolean) => void;
  setShowErrorPageTwo: (showError: boolean) => void;
  resetAll: () => void;
  setMspList: (mspList: INewMSPResponse[]) => void;
  setIsEditing: (isEditing: number[]) => void;
  setModalOpen: (
    modalOpen: null | "editedMsp" | "createdMsp" | "deletedMsp",
  ) => void;
  setMspToBeDeleted: (mspToBeDeleted: INewMSPResponse | null) => void;
  setMspTableFilter: (mspTableFilter: string) => void;
  setBrandLogo: ({
    brandLogoUrl,
    brandObjectName,
  }: {
    brandLogoUrl: string;
    brandObjectName: string;
  }) => void;
  setCityCode: (cityCode: string) => void;
  setDistrict: (district: string) => void;
  setAlertMessage: (alertMessage: string | null) => void;
  setEnterOnEditing: (enterOnEditing: boolean) => void;
  setShowCnpjError: (showCnpjError: boolean) => void;
  setShowCepError: (showCepError: boolean) => void;
  setShowAddressFields: (showAddressFields: boolean) => void;
  setIsPoc: (isPoc: boolean) => void;
  setIsPocFilter: (isPocFilter: boolean) => void;
  setDiscountRate: (discountRate: number) => void;
  setMinConsumption: (minConsumption: number) => void;
  setBrandMasterDeleted: (
    brandMasterDeleted: IBrandMasterBasicInfo | null,
  ) => void;
  setVmsToBeDeleted: (vmsToBeDeleted: IVMCreatedResponse[]) => void;
  setNotesBrandMasterDescription: (notesBrandMasterDescription: string) => void;
}

export const useZMspRegisterPage = create<IMspRegisterPageState>((set) => ({
  ...INIT_STATE,
  setActiveStep: (activeStep: 0 | 1) =>
    set((state) => ({ ...state, activeStep })),
  setCompanyName: (companyName: string) =>
    set((state) => ({ ...state, companyName })),
  setCnpj: (cnpj: string) => set((state) => ({ ...state, cnpj })),
  setPhone: (phone: string) => set((state) => ({ ...state, phone })),
  setSector: (sector: string) => set((state) => ({ ...state, sector })),
  setContactEmail: (contactEmail: string) =>
    set((state) => ({ ...state, contactEmail })),
  setCep: (cep: string) => set((state) => ({ ...state, cep })),
  setLocation: (location: string) => set((state) => ({ ...state, location })),
  setLocality: (locality: string) => set((state) => ({ ...state, locality })),
  setCountryState: (countryState: string) =>
    set((state) => ({ ...state, countryState })),
  setCity: (city: string) => set((state) => ({ ...state, city })),
  setStreet: (street: string) => set((state) => ({ ...state, street })),
  setStreetNumber: (streetNumber: string) =>
    set((state) => ({ ...state, streetNumber })),
  setAdmName: (admName: string) => set((state) => ({ ...state, admName })),
  setAdmEmail: (admEmail: string) => set((state) => ({ ...state, admEmail })),
  setAdmPhone: (admPhone: string) => set((state) => ({ ...state, admPhone })),
  setPosition: (position: string) => set((state) => ({ ...state, position })),
  setMSPDomain: (domain: string) =>
    set((state) => ({ ...state, mspDomain: domain })),
  setAdmPassword: (admPassword: string) =>
    set((state) => ({ ...state, admPassword })),
  setShowError: (showError: boolean) =>
    set((state) => ({ ...state, showError })),
  setShowErrorPageTwo: (showErrorPageTwo: boolean) =>
    set((state) => ({ ...state, showErrorPageTwo })),
  resetAll: () => set((state) => ({ ...state, ...resetState })),
  setMspList: (mspList: INewMSPResponse[]) =>
    set((state) => ({ ...state, mspList: [...mspList] })),
  setIsEditing: (isEditing: number[]) =>
    set((state) => ({ ...state, isEditing: [...isEditing] })),
  setModalOpen: (modalOpen: null | "editedMsp" | "createdMsp" | "deletedMsp") =>
    set((state) => ({ ...state, modalOpen })),
  setMspToBeDeleted: (mspToBeDeleted: INewMSPResponse | null) =>
    set((state) => ({ ...state, mspToBeDeleted })),
  setMspTableFilter: (mspTableFilter: string) =>
    set((state) => ({ ...state, mspTableFilter })),
  setBrandLogo: ({ brandLogoUrl, brandObjectName }) =>
    set((state) => ({ ...state, brandLogoUrl, brandObjectName })),
  setCityCode: (cityCode: string) => set((state) => ({ ...state, cityCode })),
  setDistrict: (district: string) => set((state) => ({ ...state, district })),
  setAlertMessage: (alertMessage: string | null) =>
    set((state) => ({ ...state, alertMessage })),
  setEnterOnEditing: (enterOnEditing: boolean) =>
    set((state) => ({ ...state, enterOnEditing })),
  setShowCnpjError: (showCnpjError: boolean) =>
    set((state) => ({ ...state, showCnpjError })),
  setShowCepError: (showCepError: boolean) =>
    set((state) => ({ ...state, showCepError })),
  setShowAddressFields: (showAddressFields: boolean) =>
    set((state) => ({ ...state, showAddressFields })),
  setIsPoc: (isPoc: boolean) => set((state) => ({ ...state, isPoc })),
  setIsPocFilter: (isPocFilter: boolean) =>
    set((state) => ({ ...state, isPocFilter })),
  setDiscountRate: (discountRate: number) =>
    set((state) => ({ ...state, discountRate })),
  setMinConsumption: (minConsumption: number) =>
    set((state) => ({ ...state, minConsumption })),
  setBrandMasterDeleted: (brandMasterDeleted: IBrandMasterBasicInfo | null) =>
    set((state) => ({ ...state, brandMasterDeleted })),
  setVmsToBeDeleted: (vmsToBeDeleted: IVMCreatedResponse[]) =>
    set((state) => ({ ...state, vmsToBeDeleted })),
  setNotesBrandMasterDescription(notesBrandMasterDescription: string) {
    set((state) => ({
      ...state,
      notesBrandMasterDescription,
    }));
  },
}));
