import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../../../stores/useZTheme";
import { TextRob16FontL } from "../../../../../components/TextL";
import { toast } from "react-toastify";
import { useZFormProfileNotifications } from "../../../../../stores/useZFormProfileNotifications";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";
import { useZBrandInfo } from "../../../../../stores/useZBrandStore";
import { api } from "../../../../../services/api";

export const CTAsButtons = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();

  const {
    fullNameForm,
    userName,
    userEmail,
    userPhone,
    password,
    confirmPassword,
    companyEmail,
    companySMS,
    timeZone,
    setFormProfileNotifications,
  } = useZFormProfileNotifications();
  const {
    idUser,
    imageUrl,
    profileImgUrl: profileImgUrlStore,
    setUser,
    fullName,
    username,
    userEmail: userEmailStore,
    userPhoneNumber,
    role,
    idBrand,
  } = useZUserProfile();
  const { emailContact, smsContact, timezone, setBrandInfo } = useZBrandInfo();

  interface UserUpdatePayload {
    fullName: string;
    username: string;
    email: string;
    userPhoneNumber: string;
    profileImgUrl?: string | null;
    password?: string;
  }

  interface UserUpdateResponse {
    fullName: string;
    username: string;
    email: string;
    userPhoneNumber: string;
    profileImgUrl?: string | null;
  }

  interface BrandUpdateResponse {
    emailContact: string;
    smsContact: string;
    timezone: string;
  }

  const handleSave = async () => {
    // Basic validations
    if (!fullNameForm.value || fullNameForm.value.length < 4) {
      return toast.error(t("profileAndNotifications.errorForm"));
    }
    if (!userName.value || userName.value.length < 4) {
      return toast.error(t("profileAndNotifications.errorForm"));
    }
    if (password.value && password.value !== confirmPassword.value) {
      return toast.error(t("colaboratorRegister.dontMatch"));
    }

    const payload: UserUpdatePayload = {
      fullName: fullNameForm.value,
      username: userName.value,
      email: userEmail.value,
      userPhoneNumber: userPhone.value,
    };
    if (imageUrl !== profileImgUrlStore) {
      payload.profileImgUrl = imageUrl ? imageUrl : null;
    }

    if (password.value) {
      payload.password = password.value;
    }

    const userResponse = await api.put<UserUpdateResponse>({
      url: `/user/${idUser}`,
      data: payload,
    });

    if (userResponse.error) {
      return toast.error(userResponse.message || t("generic.error"));
    }

    setUser({
      fullName: userResponse.data.fullName,
      username: userResponse.data.username,
      userEmail: userResponse.data.email,
      userPhoneNumber: userResponse.data.userPhoneNumber,
      profileImgUrl: userResponse.data.profileImgUrl,
      imageUrl: userResponse.data.profileImgUrl || "",
    });

    // BrandMaster updates (Admin only)
    if (role === "admin" && idBrand) {
      const brandPayload = {
        emailContact: companyEmail.value,
        smsContact: companySMS.value,
        timezone: timeZone.value,
      };

      const brandResponse = await api.put<BrandUpdateResponse>({
        url: `/brand-master/${idBrand}`,
        data: brandPayload,
      });

      if (brandResponse.error) {
        toast.error(brandResponse.message || t("generic.error"));
        return;
      }

      setBrandInfo({
        emailContact: brandResponse.data.emailContact,
        smsContact: brandResponse.data.smsContact,
        timezone: brandResponse.data.timezone,
      });
    }

    toast.success(t("generic.dataSavesuccess"));
  };

  const handleReset = () => {
    setFormProfileNotifications({
      fullNameForm: { value: fullName || "", errorMessage: "" },
      userName: { value: username || "", errorMessage: "" },
      userEmail: { value: userEmailStore || "", errorMessage: "" },
      userPhone: { value: userPhoneNumber || "", errorMessage: "" },
      password: { value: "", errorMessage: "" },
      confirmPassword: { value: "", errorMessage: "" },
      companyEmail: { value: emailContact || "", errorMessage: "" },
      companySMS: { value: smsContact || "", errorMessage: "" },
      timeZone: { value: timezone || "", errorMessage: "" },
    });
  };

  return (
    <Stack
      flexDirection={"row"}
      sx={{
        gap: "24px",
        "@media (max-width: 745px)": {
          flexDirection: "column",
        },
      }}
    >
      <Button
        sx={{
          background: theme[mode].blue,
          border: `1px solid ${theme[mode].blue}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
        onClick={handleSave}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].btnText,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.saveChanges")}
        </TextRob16FontL>
      </Button>
      <Button
        sx={{
          background: "transparent",
          border: `1px solid ${theme[mode].blueDark}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
        }}
        onClick={handleReset}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].blueDark,
            fontWeight: "500",
            fontFamily: "Roboto",
            lineHeight: "16px",
          }}
        >
          {t("profileAndNotifications.redefineAllData")}
        </TextRob16FontL>
      </Button>
    </Stack>
  );
};
