import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../../stores/useZTheme";
import { TextRob14FontXsB } from "../../../../components/TextXsB";
import { Link } from "react-router-dom";
import { useZBrandInfo } from "../../../../stores/useZBrandStore";

export const Contact = ({
  SeparatorColor,
  textColor,
  noMarginTop = false,
}: {
  SeparatorColor?: string;
  textColor?: string;
  noMarginTop?: boolean;
}) => {
  const { mode, theme } = useZTheme();
  const { t } = useTranslation();
  const { brandName, brandSite, brandPrivacyPolicy, brandContact } =
    useZBrandInfo();
  const brandColor = textColor || theme[mode].btnDarkBlue;
  const fallbackLink = "/";
  return (
    <Stack
      sx={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: noMarginTop ? 0 : "48px",
        alignItems: "center",
        gap: "8px",
        marginTop: noMarginTop ? 0 : "auto",
      }}
    >
      <Link to={brandSite || fallbackLink} target="_blank">
        <TextRob14FontXsB
          sx={{
            color: brandColor,
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}
        >
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.99998 13.6667C6.07776 13.6667 5.21109 13.4917 4.39998 13.1417C3.58887 12.7917 2.88331 12.3167 2.28331 11.7167C1.68331 11.1167 1.20831 10.4111 0.858313 9.60001C0.508313 8.7889 0.333313 7.92223 0.333313 7.00001C0.333313 6.07779 0.508313 5.21112 0.858313 4.40001C1.20831 3.5889 1.68331 2.88334 2.28331 2.28334C2.88331 1.68334 3.58887 1.20834 4.39998 0.858344C5.21109 0.508344 6.07776 0.333344 6.99998 0.333344C7.9222 0.333344 8.78887 0.508344 9.59998 0.858344C10.4111 1.20834 11.1166 1.68334 11.7166 2.28334C12.3166 2.88334 12.7916 3.5889 13.1416 4.40001C13.4916 5.21112 13.6666 6.07779 13.6666 7.00001C13.6666 7.92223 13.4916 8.7889 13.1416 9.60001C12.7916 10.4111 12.3166 11.1167 11.7166 11.7167C11.1166 12.3167 10.4111 12.7917 9.59998 13.1417C8.78887 13.4917 7.9222 13.6667 6.99998 13.6667ZM6.99998 12.3333C8.48887 12.3333 9.74998 11.8167 10.7833 10.7833C11.8166 9.75001 12.3333 8.4889 12.3333 7.00001C12.3333 5.51112 11.8166 4.25001 10.7833 3.21668C9.74998 2.18334 8.48887 1.66668 6.99998 1.66668C5.51109 1.66668 4.24998 2.18334 3.21665 3.21668C2.18331 4.25001 1.66665 5.51112 1.66665 7.00001C1.66665 8.4889 2.18331 9.75001 3.21665 10.7833C4.24998 11.8167 5.51109 12.3333 6.99998 12.3333ZM5.66665 9.66668H8.33331C8.5222 9.66668 8.68054 9.60279 8.80831 9.47501C8.93609 9.34723 8.99998 9.1889 8.99998 9.00001V8.33334C8.99998 8.14445 8.93609 7.98612 8.80831 7.85834C8.68054 7.73057 8.5222 7.66668 8.33331 7.66668C8.14442 7.66668 7.98609 7.73057 7.85831 7.85834C7.73054 7.98612 7.66665 8.14445 7.66665 8.33334H6.33331V5.66668H7.66665C7.66665 5.85557 7.73054 6.0139 7.85831 6.14168C7.98609 6.26945 8.14442 6.33334 8.33331 6.33334C8.5222 6.33334 8.68054 6.26945 8.80831 6.14168C8.93609 6.0139 8.99998 5.85557 8.99998 5.66668V5.00001C8.99998 4.81112 8.93609 4.65279 8.80831 4.52501C8.68054 4.39723 8.5222 4.33334 8.33331 4.33334H5.66665C5.47776 4.33334 5.31942 4.39723 5.19165 4.52501C5.06387 4.65279 4.99998 4.81112 4.99998 5.00001V9.00001C4.99998 9.1889 5.06387 9.34723 5.19165 9.47501C5.31942 9.60279 5.47776 9.66668 5.66665 9.66668Z"
                fill={brandColor}
              />
            </svg>
          </>
          {brandName}
        </TextRob14FontXsB>
      </Link>
      {/* Separator */}
      <Stack
        sx={{
          width: "8px",
          height: "4px",
          borderRadius: "4px",
          backgroundColor: SeparatorColor || theme[mode].grayLight,
        }}
      />
      <Link to={brandContact || fallbackLink} target="_blank">
        <TextRob14FontXsB
          sx={{
            color: brandColor,
          }}
        >
          {t("loginRegister.contact")}
        </TextRob14FontXsB>
      </Link>
      <Stack
        sx={{
          width: "8px",
          height: "4px",
          borderRadius: "4px",
          backgroundColor: SeparatorColor || theme[mode].grayLight,
        }}
      />
      <Link to={brandPrivacyPolicy || fallbackLink} target="_blank">
        <TextRob14FontXsB
          sx={{
            color: brandColor,
          }}
        >
          {t("loginRegister.privacyAndPolicy")}
        </TextRob14FontXsB>
      </Link>
    </Stack>
  );
};
