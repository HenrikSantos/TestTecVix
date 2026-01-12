import { useTranslation } from "react-i18next";
import { themeColors, useZTheme } from "../../../../stores/useZTheme";
import { useUploadFile } from "../../../../hooks/useUploadFile";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { TextRob16Font1S } from "../../../../components/Text1S";
import { Box, Button } from "@mui/material";
import { UploadFileIcon } from "../../../../icons/UploadFileIcon";
import { TextRob12Font2Xs } from "../../../../components/Text2Xs";
import { CircleIcon } from "../../../../icons/CircleIcon";
import { TextRob16FontL } from "../../../../components/TextL";
import { useZBrandInfo } from "../../../../stores/useZBrandStore";

interface IWhiteLabelChildProps {
  theme: {
    dark: themeColors;
    light: themeColors;
  };
}

export const LeftCardLogo = ({ theme }: IWhiteLabelChildProps) => {
  const { mode } = useZTheme();
  const { t } = useTranslation();
  const { handleUpload, isUploading } = useUploadFile();
  const { setBrandInfo, brandLogoTemp } = useZBrandInfo();
  const [uploadedFile, setUploadedFile] = useState<string | null>(
    brandLogoTemp,
  );

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Seleciona o primeiro arquivo
    const response = await handleUpload(file);

    if (response && response.url) {
      setUploadedFile(response.url); // Atualiza a URL do logo carregado
      setBrandInfo({
        brandLogoTemp: response.url,
        brandObjectName: response.objectName,
      });
    }
  };

  const hadleRemoveLogo = () => {
    setBrandInfo({ brandLogoTemp: "" });
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"] },
    maxSize: 50 * 1024 * 1024, // Limita para 50MB
  });

  useEffect(() => {
    if (!brandLogoTemp) {
      setUploadedFile(null);
    }
  }, [brandLogoTemp]);

  return (
    <>
      <TextRob16Font1S
        sx={{
          color: theme[mode].primary,
          fontWeight: "500",
          fontSize: "16px",
          marginBottom: "16px",
        }}
      >
        {t("whiteLabel.brandLogo")}
      </TextRob16Font1S>
      <Box
        {...getRootProps()}
        sx={{
          width: "100%",
          height: "216px",
          border: `1px solid ${theme[mode].grayLight}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          borderRadius: "16px",
          background: isDragActive
            ? theme[mode].grayLight
            : theme[mode].lightV2,
          marginBottom: "24px",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <UploadFileIcon color={theme[mode].tertiary} />
        <TextRob12Font2Xs
          sx={{
            color: theme[mode].tertiary,
            fontWeight: "400",
            fontSize: "12px",
            maxWidth: "136px",
            textAlign: "center",
            lineHeight: "20px",
            userSelect: "none",
          }}
        >
          {isUploading ? t("whiteLabel.loading") : t("whiteLabel.clickHere")}
        </TextRob12Font2Xs>
      </Box>
      {uploadedFile && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <img
            src={uploadedFile}
            alt="Logo carregado"
            style={{
              maxWidth: "100%",
              maxHeight: "100px",
              objectFit: "contain",
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "24px",
          "@media (max-width: 440px)": {
            flexDirection: "column",
          },
        }}
      >
        <Button
          sx={{
            background: theme[mode].blue,
            border: `1px solid ${theme[mode].blue}`,
            color: theme[mode].btnText,
            textTransform: "none",
            borderRadius: "12px",
            flexGrow: 2,
            height: "48px",
            fontWeight: "500",
            fontSize: "16px",
            "@media (max-width: 440px)": {
              flexGrow: 0,
              width: "100%",
            },
          }}
          onClick={open}
        >
          {t("whiteLabel.changeLogo")}
        </Button>
        <Button
          sx={{
            background: "transparent",
            color: theme[mode].blueDark,
            border: `1px solid ${theme[mode].blueDark}`,
            textTransform: "none",
            borderRadius: "12px",
            flexGrow: 1,
            height: "48px",
            fontWeight: "500",
            fontSize: "16px",
            "@media (max-width: 440px)": {
              flexGrow: 0,
              width: "100%",
            },
          }}
          onClick={hadleRemoveLogo}
        >
          {t("whiteLabel.removeLogo")}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.defaultSize")}
          </TextRob16FontL>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.maxSize")}
          </TextRob16FontL>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <CircleIcon color={theme.light.blueMedium} />
          <TextRob16FontL
            sx={{
              color: theme[mode].tertiary,
              fontWeight: "400",
              fontSize: "16px",
            }}
          >
            {t("whiteLabel.acceptedFormats")}
          </TextRob16FontL>
        </Box>
      </Box>
    </>
  );
};
