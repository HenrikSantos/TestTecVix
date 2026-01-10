import { useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { IListAll } from "../types/ListAllTypes";
import { useZUserProfile } from "../stores/useZUserProfile";
import { useTranslation } from "react-i18next";
import { useZBrandInfo } from "../stores/useZBrandStore";
import { useUploadFile } from "./useUploadFile";
import { IBrandMasterBasicInfo } from "../types/BrandMasterTypes";

interface IUpdateBrandMaster {
  brandName?: string;
  idBrandTheme?: number;
  isActive?: boolean;
  brandLogo?: string;
  domain?: string;
  emailContact?: string;
  cnpj?: string;
  setorName?: string;
  location?: string;
  state?: string;
  city?: string;
  cep?: string;
  street?: string;
  placeNumber?: string;
  smsContact?: string;
  mspDomain?: string;
  admName?: string;
  admEmail?: string;
  admPhone?: string;
  admPassword?: string;
  cityCode?: number;
  district?: string;
  isPoc?: boolean;
  discountRate?: number;
  minConsumption?: number;
  manual?: string;
  termsOfUse?: string;
  privacyPolicy?: string;
  retailPercentageDefault?: string | number;
}

interface IBrandMasterResource {
  brandName: string;
  idBrandTheme: number;
  isActive: boolean;
  brandLogo: string;
  domain: string;
  setorName: string;
  fieldName: string;
  location: string;
  city: string;
  emailContact: string;
  smsContact: string;
  timezone: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
  stripeUserId?: string | null;
  discountRate?: number;
  minConsumption?: number;
  manual?: string;
  termsOfUse?: string;
  privacyPolicy?: string;
  hasSelfRegister?: boolean;
  hasPrepaid?: boolean;
  retailPercentageDefault?: string | number;
}

interface ICreateNewBrandMaster {
  companyName: string;
  cnpj: string;
  phone: string;
  sector: string;
  contactEmail: string;
  cep: string;
  locality: string;
  countryState: string;
  city: string;
  street: string;
  streetNumber: string;
  admName: string;
  admEmail: string;
  admPhone: string;
  admPassword: string;
  brandLogo: string;
  position: "admin";
  mspDomain: string;
  cityCode?: number;
  district?: string;
  isPoc?: boolean;
  discountRate?: number;
  minConsumption?: number;
}

export interface INewMSPResponse {
  idBrandMaster: number;
  brandLogo: string | null;
  brandName: string | null;
  cep: null | string;
  city: string | null;
  cnpj: string | null;
  domain: string | null;
  contract: string | null;
  emailContact: string | null;
  fieldName: string | null;
  idBrandTheme: number;
  isActive: boolean;
  location: string | null;
  placeNumber: string | null;
  setorName: string | null;
  smsContact: string | null;
  state: string | null;
  street: string | null;
  timezone: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
  deletedAt: Date | string | null;
  stripeUserId?: string | null;
  isStripeActive?: boolean | null;
  cityCode: number | null;
  district: string | null;
  isPoc: boolean;
  discountRate?: number | string;
  minConsumption?: number;
  manual?: string | null;
  termsOfUse?: string | null;
  privacyPolicy?: string | null;
  hasSelfRegister?: boolean;
  hasPrepaid?: boolean;
  retailPercentageDefault?: string | number;
}

export const useBrandMasterResources = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { getAuth } = useAuth();
  const { role, idBrand } = useZUserProfile();
  const { t } = useTranslation();
  const {
    brandName,
    setBrandInfo,
    idBrand: idBrandInfo,
    domain,
  } = useZBrandInfo();
  const { getFileByObjectName } = useUploadFile();

  const updateBrandMaster = async ({
    brandName,
    idBrandTheme,
    brandLogo,
    domain,
  }: IUpdateBrandMaster) => {
    if (!role || (role !== "admin" && role !== "manager")) return;
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.put({
      url: `/brand-master/${idBrand}`,
      auth,
      data: {
        brandName,
        idBrandTheme,
        brandLogo,
        domain,
      },
    });
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    toast.success(t("whiteLabel.dnsSaved"));
    return response.data;
  };

  const updateBrandMasterInfo = async (data: Partial<IBrandMasterResource>) => {
    if (data.brandName && brandName !== data.brandName && role !== "admin") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }

    if (data.domain && domain !== data.domain && role !== "admin") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }

    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.put<IBrandMasterResource>({
      url: `/brand-master/${idBrand}`,
      auth,
      data,
    });
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    const dataResponse = response.data;
    const { url } = await getFileByObjectName(dataResponse.brandLogo);
    setBrandInfo({
      brandName: dataResponse.brandName,
      brandLogo: url || "",
      domain: dataResponse.domain || "",
      setorName: dataResponse.setorName || "",
      fieldName: dataResponse.fieldName || "",
      location: dataResponse.location || "",
      city: dataResponse.city || "",
      emailContact: dataResponse.emailContact || "",
      smsContact: dataResponse.smsContact || "",
      timezone: dataResponse.timezone || "",
      stripeUserId: dataResponse?.stripeUserId || null,
      discountRate: Number(dataResponse?.discountRate) || 1,
      manual: dataResponse?.manual || null,
      termsOfUse: dataResponse?.termsOfUse || null,
      privacyPolicy: dataResponse?.privacyPolicy || null,
      hasSelfRegister: dataResponse?.hasSelfRegister || false,
    });

    return response.data;
  };

  const updateDomain = async (domain: string) => {
    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }

    if (role !== "admin" && true) {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }

    if (idBrandInfo !== idBrand) {
      toast.error(t("generic.errorToSaveData"));
      return;
    }

    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.post({
      url: `/dns/register`,
      auth,
      data: {
        idBrandMaster: idBrand,
        domain,
      },
    });
    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }

    return response.data;
  };

  const createAnewBrandMaster = async (data: ICreateNewBrandMaster) => {
    if (!data) return null;

    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.post<INewMSPResponse>({
      url: `/brand-master`,
      auth,
      data: {
        brandName: data.companyName,
        idBrandTheme: 1,
        isActive: true,
        brandLogo: data.brandLogo,
        domain: undefined,
        setorName: data.sector,
        fieldName: undefined,
        location: data.locality,
        city: data.city,
        emailContact: data.contactEmail,
        smsContact: data.phone,
        timezone: undefined,
        state: data.countryState,
        street: data.street,
        placeNumber: data.streetNumber,
        cnpj: data.cnpj,
        cep: data.cep,
        cityCode: data?.cityCode ? data.cityCode : undefined,
        district: data?.district ? data.district : undefined,
        isPoc: Boolean(data?.isPoc),
        discountRate: data?.discountRate,
        minConsumption: data?.minConsumption,
      },
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }

    return { brandMaster: response.data };
  };

  const listAllBrands = async () => {
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<IListAll<INewMSPResponse>>({
      url: "/brand-master",
      auth,
    });
    setIsLoading(true);

    if (response.error) {
      toast.error(response.message);

      return {
        totalCount: 0,
        result: [],
      };
    }
    return response.data;
  };

  const deleteBrandMaster = async (brandMasterId: number | string) => {
    if (!brandMasterId) return null;

    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.delete<{
      brandMaster: IBrandMasterBasicInfo;
    }>({
      url: `/brand-master/${brandMasterId}`,
      auth,
    });

    setIsLoading(false);
    if (response.error) {
      toast.error(response.message);
      return;
    }
    return response.data;
  };

  const editBrandMaster = async (
    brandMasterId: number | string,
    data: IUpdateBrandMaster,
  ) => {
    if (!brandMasterId) return null;
    if (!data) return null;
    if (role !== "admin" && role !== "manager") {
      toast.error(t("generic.errorOlnlyAdmin"));
      return;
    }
    const auth = await getAuth();
    const response = await api.put<INewMSPResponse>({
      url: `/brand-master/${brandMasterId}`,
      auth,
      data: {
        brandName: data.brandName,
        emailContact: data.emailContact,
        cnpj: data.cnpj,
        setorName: data.setorName,
        location: data.location,
        state: data.state,
        city: data.city,
        cep: data.cep,
        street: data.street,
        placeNumber: data.placeNumber,
        smsContact: data.smsContact,
        brandLogo: data.brandLogo,
        cityCode: data?.cityCode ? data.cityCode : undefined,
        district: data?.district ? data.district : undefined,
        isPoc: Boolean(data?.isPoc),
        discountRate: data?.discountRate,
        minConsumption: data?.minConsumption,
        retailPercentageDefault: Number(data?.retailPercentageDefault)
          ? Number(data?.retailPercentageDefault)
          : undefined,
      },
    });

    if (response.error) {
      toast.error(response.message);
      return;
    }

    return {
      brandMaster: response.data,
    };
  };

  const getSelf = async () => {
    if (!idBrand) return null;
    const auth = await getAuth();
    setIsLoading(true);
    const response = await api.get<INewMSPResponse>({
      url: `/brand-master/${idBrand}`,
      auth,
    });
    setIsLoading(true);

    if (response.error) {
      toast.error(response.message);
      return null;
    }
    return response.data;
  };

  return {
    isLoading,
    updateBrandMaster,
    updateBrandMasterInfo,
    updateDomain,
    createAnewBrandMaster,
    listAllBrands,
    deleteBrandMaster,
    editBrandMaster,
    getSelf,
  };
};

/*
export const brandMasterSchema = z.object({
  brandName: z.string().nullable().optional(),
  idBrandTheme: z.number().int().nullable().optional(),
  isActive: z.boolean().optional().default(false).optional(),
  brandLogo: z.string().nullable().optional(),
  domain: z.string().nullable().optional(),
  setorName: z.string().nullable().optional(),
  fieldName: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  emailContact: z.string().nullable().optional(),
  smsContact: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  street: z.string().nullable().optional(),
  placeNumber: z.string().nullable().optional(),
  cnpj: z.string().nullable().optional(),
});
*/
