import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../../../stores/useZTheme";
import { Stack } from "@mui/material";
import { TextRob16FontL } from "../../../../../components/TextL";
import { InputLabelAndFeedback } from "../../../../../components/Inputs/InputLabelAndFeedback";
import { EditCirclePencilIcon } from "../../../../../icons/EditCirclePencilIcon";
import { DropDrownLabel } from "../../../../../components/Inputs/DropDrownLabel";
import { useGenericResources } from "../../../../../hooks/useGenericResources";
import {
  IFormProfileNotificationsVar,
  useZFormProfileNotifications,
} from "../../../../../stores/useZFormProfileNotifications";
import { useZBrandInfo } from "../../../../../stores/useZBrandStore";
import { useZUserProfile } from "../../../../../stores/useZUserProfile";
import { useEffect } from "react";
import { maskPhone } from "../../../../../utils/maskPhone";

export const NotificationsContact = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { timeZones } = useGenericResources();
  const { companyEmail, companySMS, timeZone, setFormProfileNotifications } =
    useZFormProfileNotifications();
  const { emailContact, smsContact, timezone } = useZBrandInfo();
  const { role } = useZUserProfile();
  const isEditable = role === "admin";

  const validEmail = () => {
    if (!isEditable) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex para validar email
    if (!companyEmail.value) {
      return setFormProfileNotifications({
        companyEmail: {
          ...companyEmail,
          errorMessage: t("profileAndNotifications.requiredField"),
        },
      });
    }

    if (
      !emailRegex.test(companyEmail.value) ||
      companyEmail.value.length > 100
    ) {
      return setFormProfileNotifications({
        companyEmail: {
          ...companyEmail,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }

    // Se o email for válido
    return setFormProfileNotifications({
      companyEmail: {
        ...companyEmail,
        errorMessage: "",
      },
    });
  };

  const validPhoneNumber = () => {
    if (!isEditable) return;
    const phoneRegex = /^\d+$/;
    const cleanPhone = companySMS.value.replace(/\D/g, "");

    if (!companySMS.value) {
      return setFormProfileNotifications({
        companySMS: {
          ...companySMS,
          errorMessage: "",
        },
      });
    }

    if (!phoneRegex.test(cleanPhone) || cleanPhone.length > 20) {
      return setFormProfileNotifications({
        companySMS: {
          ...companySMS,
          errorMessage: t("profileAndNotifications.invalidData"),
        },
      });
    }

    // Se o telefone for válido
    return setFormProfileNotifications({
      companySMS: {
        ...companySMS,
        errorMessage: "",
      },
    });
  };

  const handleChange = (
    key: keyof IFormProfileNotificationsVar,
    val: string,
  ) => {
    if (!isEditable) return;
    setFormProfileNotifications({
      [key]: {
        ...[key],
        value: val,
      },
    });
  };

  useEffect(() => {
    setFormProfileNotifications({
      companyEmail: {
        ...companyEmail,
        value: emailContact || "",
        errorMessage: "",
      },
      companySMS: {
        ...companySMS,
        value: smsContact || "",
        errorMessage: "",
      },
      timeZone: {
        ...timeZone,
        value: timezone || "",
        errorMessage: "",
      },
    });
  }, [emailContact, smsContact, timezone]);

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
          {t("profileAndNotifications.notifications")}
        </TextRob16FontL>
      </Stack>
      {/* Inputs */}
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
          label={t("profileAndNotifications.email")}
          placeholder={t("profileAndNotifications.email")}
          value={companyEmail.value}
          onChange={(val) => handleChange("companyEmail", val)}
          errorMessage={companyEmail.errorMessage}
          disabled={!isEditable}
          onBlur={() => validEmail()}
          icon={
            <EditCirclePencilIcon
              fill={
                companyEmail.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
        />
        <InputLabelAndFeedback
          label={t("profileAndNotifications.sms")}
          placeholder="(00) 00000-0000"
          value={companySMS.value}
          onChange={(val) => handleChange("companySMS", maskPhone(val))}
          errorMessage={companySMS.errorMessage}
          disabled={!isEditable}
          onBlur={() => validPhoneNumber()}
          icon={
            <EditCirclePencilIcon
              fill={
                companySMS.errorMessage
                  ? theme[mode].danger
                  : theme[mode].blueMedium
              }
            />
          }
        />
        {
          <DropDrownLabel
            label={t("profileAndNotifications.timeZone")}
            placeholder={t("profileAndNotifications.timeZone")}
            data={timeZones}
            disabled={!isEditable}
            value={
              timeZone.value
                ? { label: timeZone.value, value: timeZone.value }
                : null
            }
            onChange={(val) => {
              if (!val) return handleChange("timeZone", "");
              return handleChange("timeZone", val.label);
            }}
          />
        }
      </Stack>
    </Stack>
  );
};
