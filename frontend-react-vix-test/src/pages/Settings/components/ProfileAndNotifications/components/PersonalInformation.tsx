import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TextRob16FontL } from "../../../../../components/TextL";
import { useZTheme } from "../../../../../stores/useZTheme";
import { InputLabelAndFeedback } from "../../../../../components/Inputs/InputLabelAndFeedback";
import { EditCirclePencilIcon } from "../../../../../icons/EditCirclePencilIcon";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";
import {
  IFormProfileNotificationsVar,
  useZFormProfileNotifications,
} from "../../../../../stores/useZFormProfileNotifications";
import { useEffect } from "react";
import { PerfilPhotoUpload } from "./PerfilPhotoUpload";
import { maskPhone } from "../../../../../utils/maskPhone";

export const PersonalInformation = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { username, userEmail, userPhoneNumber, fullName } = useZUserProfile();
  const {
    userEmail: userEmailForm,
    userName,
    userPhone,
    password,
    confirmPassword,
    fullNameForm,
    setFormProfileNotifications,
  } = useZFormProfileNotifications();

  const inputSx = {
    maxWidth: "400px",
    width: "100%",
    "@media (max-width: 745px)": {
      maxWidth: "100%",
    },
  };
  const sxContainer = {
    maxWidth: "400px",
    width: "100%",
    "@media (max-width: 745px)": {
      maxWidth: "100%",
    },
  };
  const sxLabel = {};
  const sxSideLabel = {};

  const validFullName = () => {
    if (!fullNameForm.value) {
      setFormProfileNotifications({
        fullNameForm: {
          ...fullNameForm,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
      return;
    }
    if (fullNameForm.value.length < 4 || fullNameForm.value.length > 100) {
      setFormProfileNotifications({
        fullNameForm: {
          ...fullNameForm,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
      return;
    }
    setFormProfileNotifications({
      fullNameForm: {
        ...fullNameForm,
        errorMessage: "",
      },
    });

    return true;
  };

  const validName = () => {
    if (!userName.value) {
      setFormProfileNotifications({
        userName: {
          ...userName,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
      return;
    }
    if (userName.value.length < 4 || userName.value.length > 100) {
      setFormProfileNotifications({
        userName: {
          ...userName,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
      return;
    }
    setFormProfileNotifications({
      userName: {
        ...userName,
        errorMessage: "",
      },
    });

    return true;
  };

  const validPassword = () => {
    if (password.value && password.value !== confirmPassword.value) {
      setFormProfileNotifications({
        password: {
          ...password,
          errorMessage: t("colaboratorRegister.dontMatch"),
        },
      });
      return;
    }

    setFormProfileNotifications({
      password: {
        ...password,
        errorMessage: "",
      },
    });

    return true;
  };

  const validEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar email
    if (!userEmailForm.value) {
      return setFormProfileNotifications({
        userEmail: {
          ...userEmailForm,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
    }

    if (
      !emailRegex.test(userEmailForm.value) ||
      userEmailForm.value.length > 100
    ) {
      return setFormProfileNotifications({
        userEmail: {
          ...userEmailForm,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }

    // Se o email for válido
    return setFormProfileNotifications({
      userEmail: {
        ...userEmailForm,
        errorMessage: "",
      },
    });
  };

  const validPhoneNumber = () => {
    const phoneRegex = /^\d{10,11}$/; // Regex para validar telefone com 10 ou 11 dígitos
    const cleanPhone = userPhone.value.replace(/\D/g, "");

    if (!userPhone.value) {
      return setFormProfileNotifications({
        userPhone: {
          ...userPhone,
          errorMessage: "",
        },
      });
    }

    if (!phoneRegex.test(cleanPhone) || cleanPhone.length > 20) {
      return setFormProfileNotifications({
        userPhone: {
          ...userPhone,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }

    // Se o telefone for válido
    return setFormProfileNotifications({
      userPhone: {
        ...userPhone,
        errorMessage: "",
      },
    });
  };

  const handleChange = (
    key: keyof IFormProfileNotificationsVar,
    val: string,
  ) => {
    setFormProfileNotifications({
      [key]: {
        ...[key],
        value: val,
      },
    });
  };

  useEffect(() => {
    setFormProfileNotifications({
      fullNameForm: {
        ...fullNameForm,
        value: fullName || "",
        errorMessage: "",
      },
      userName: {
        ...userName,
        value: username || "",
        errorMessage: "",
      },
      userEmail: {
        ...userEmailForm,
        value: userEmail || "",
        errorMessage: "",
      },
      userPhone: {
        ...userPhone,
        value: userPhoneNumber || "",
        errorMessage: "",
      },
    });
  }, [fullName, username, userEmail, userPhoneNumber]);

  return (
    <Stack
      sx={{
        gap: "24px",
      }}
    >
      {/* Title */}
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <TextRob16FontL
          sx={{
            color: theme[mode].black,
            fontWeight: "500",
            lineHeight: "24px",
          }}
        >
          {t("profileAndNotifications.personalData")}
        </TextRob16FontL>
      </Stack>
      {/* Inputs line 01 */}
      <Stack
        sx={{
          flexDirection: "row",
          gap: "24px",
          "@media (max-width: 745px)": {
            flexDirection: "column",
          },
        }}
      >
        <InputLabelAndFeedback
          label={t("profileAndNotifications.completeName")}
          placeholder={t("profileAndNotifications.completeName")}
          value={fullNameForm.value}
          onChange={(val) => handleChange("fullNameForm", val)}
          errorMessage={fullNameForm.errorMessage}
          icon={
            <EditCirclePencilIcon
              fill={
                fullNameForm.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
          onBlur={validFullName}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
        <InputLabelAndFeedback
          label={t("profileAndNotifications.username")}
          placeholder={t("profileAndNotifications.username")}
          value={userName.value}
          onChange={(val) => handleChange("userName", val)}
          errorMessage={userName.errorMessage}
          icon={
            <EditCirclePencilIcon
              fill={
                userName.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
          onBlur={validName}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
        <InputLabelAndFeedback
          label={t("profileAndNotifications.email")}
          placeholder={t("profileAndNotifications.email")}
          value={userEmailForm.value}
          errorMessage={userEmailForm.errorMessage}
          onChange={(val) => handleChange("userEmail", val)}
          icon={
            <EditCirclePencilIcon
              fill={
                userEmailForm.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
          onBlur={validEmail}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
        <InputLabelAndFeedback
          label={t("profileAndNotifications.phone")}
          placeholder="(00) 0000-0000"
          value={userPhone.value}
          errorMessage={userPhone.errorMessage}
          onBlur={validPhoneNumber}
          onChange={(val) => handleChange("userPhone", maskPhone(val))}
          icon={
            <EditCirclePencilIcon
              fill={
                userPhone.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
        />
      </Stack>
      {/* Inputs line 02 */}
      <Stack
        sx={{
          flexDirection: "row",
          gap: "24px",
          "@media (max-width: 745px)": {
            flexDirection: "column",
          },
        }}
      >
        <InputLabelAndFeedback
          type="password"
          label={t("colaboratorRegister.password")}
          placeholder="••••••••"
          value={password.value}
          onChange={(val) => handleChange("password", val)}
          errorMessage={password.errorMessage}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
          autoComplete="new-password"
        />
        <InputLabelAndFeedback
          type="password"
          label={t("colaboratorRegister.confirmPassword")}
          placeholder="••••••••"
          value={confirmPassword.value}
          onChange={(val) => handleChange("confirmPassword", val)}
          errorMessage={confirmPassword.errorMessage}
          onBlur={validPassword}
          sx={inputSx}
          sxContainer={sxContainer}
          sxLabel={sxLabel}
          sxSidelabel={sxSideLabel}
          autoComplete="new-password"
        />
      </Stack>
      <Stack
        sx={{
          width: "100%",
        }}
      >
        <PerfilPhotoUpload />
      </Stack>
    </Stack>
  );
};
