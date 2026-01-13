import { useZBrandInfo } from "../stores/useZBrandStore";
import { useZTheme } from "../stores/useZTheme";
import { IBrandMasterResponse } from "../types/BrandMasterTypes";
import { useUploadFile } from "./useUploadFile";

export const useBrandMasterInfos = () => {
  const { getFileByObjectName } = useUploadFile();
  const { setBrandInfo } = useZBrandInfo();
  const { setTheme, themeName, version } = useZTheme();

  const setBrandInfos = async (data: IBrandMasterResponse) => {
    const url = data.brandLogo
      ? (await getFileByObjectName(data.brandLogo)).url
      : "";

    setBrandInfo({
      idBrand: data.idBrandMaster,
      brandName: data.brandName,
      brandLogo: url || "",
      domain: data.domain || "",
      setorName: data.setorName || "",
      fieldName: data.fieldName || "",
      location: data.location || "",
      city: data.city || "",
      emailContact: data.emailContact || "",
      smsContact: data.smsContact || "",
      timezone: data.timezone || "",
      stripeUserId: data.stripeUserId || null,
      discountRate: Number(data.discountRate) || 1,
      manual: data?.manual || null,
      termsOfUse: data?.termsOfUse || null,
      privacyPolicy: data?.privacyPolicy || null,
    });

    if (!data.brandTheme) return;
    if (
      themeName === data.brandTheme?.themeName &&
      version === data.brandTheme?.version
    )
      return;

    setTheme({
      light: data.brandTheme?.themeLight,
      dark: data.brandTheme?.themeDark,
      themeName: data.brandTheme?.themeName,
      themeNameDefault: data.brandTheme?.themeName,
      version: data.brandTheme?.version,
    });
  };

  return { setBrandInfos };
};
