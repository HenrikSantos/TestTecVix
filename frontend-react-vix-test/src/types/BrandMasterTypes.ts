import { themeColors } from "../stores/useZTheme";

export interface IBrandMasterResponse {
  idBrandMaster: number;
  brandLogo: string | null;
  brandName: string;
  domain: string;
  emailContact: null;
  fieldName: null;
  location: string | null;
  setorName: string | null;
  smsContact: string | null;
  timezone: string | null;
  city: string | null;
  brandTheme: {
    themeName: string;
    mode: "light" | "dark";
    themeDark: themeColors;
    themeLight: themeColors;
    version: number;
  } | null;
  stripeUserId: string | null;
  discountRate?: number;
  minConsumption?: number;
  manual?: string | null;
  termsOfUse?: string | null;
  privacyPolicy?: string | null;
}

export interface IBrandMasterBasicInfo {
  idBrandMaster: number;
  brandName: string;
}
