import { useTranslation } from "react-i18next";
import { useZTheme } from "../../stores/useZTheme";
import { useUploadFile } from "../../hooks/useUploadFile";
import { useDropzone } from "react-dropzone";
import { Box, Stack, SxProps, Tooltip } from "@mui/material";
import { TextRob16FontL } from "../TextL";
import { TooltipIcon } from "../../icons/TooltipIcon";
import { UploadIcon } from "../../icons/UploadIcon";

interface IProps {
  onUploaded: ({
    url,
    objectName,
  }: {
    url: string;
    objectName: string;
  }) => void;
  toolTipMessage?: React.ReactNode;
  label?: React.ReactNode;
  sxLabel?: SxProps;
  sxContainer?: SxProps;
  disabled?: boolean;
}
export const InputUploadLabelTooltip = ({
  onUploaded,
  toolTipMessage,
  label,
  sxLabel,
  sxContainer,
  disabled,
}: IProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const { handleUpload, isUploading } = useUploadFile();

  const onDrop = async (acceptedFiles: File[]) => {
    if (disabled) return;
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0]; // Seleciona o primeiro arquivo
    const response = await handleUpload(file);

    if (response && response.url) {
      onUploaded({
        url: response.url,
        objectName: response.objectName,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"] },
    maxSize: 50 * 1024 * 1024, // Limita para 50MB
  });

  return (
    <Stack
      width={"100%"}
      sx={{
        ...sxContainer,
      }}
    >
      {(label || toolTipMessage) && (
        <Stack
          flexDirection={"row"}
          gap={"8px"}
          alignItems={"center"}
          sx={{ marginBottom: "8px" }}
        >
          <TextRob16FontL
            sx={{
              color: theme[mode].black,
              fontSize: "14px",
              fontFamily: "Roboto",
              fontWeight: "400",
              lineHeight: "16px",
              wordWrap: "break-word",
              ...sxLabel,
            }}
          >
            {label}
          </TextRob16FontL>
          {Boolean(toolTipMessage) && (
            <Tooltip title={toolTipMessage}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TooltipIcon fill={theme[mode].btnDarkBlue} />
              </div>
            </Tooltip>
          )}
        </Stack>
      )}
      <Box
        {...getRootProps()}
        sx={{
          width: "100%",
          height: "120px", // Increased height
          border: `1px dashed ${theme[mode].gray}`,
          display: "flex",
          flexDirection: "column", // Column layout
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          borderRadius: "12px",
          background: theme[mode].grayLight,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <input {...getInputProps()} disabled={disabled} />
        <UploadIcon fill={theme[mode].gray} width="32px" height="32px" />
        <TextRob16FontL
          sx={{
            color: theme[mode].gray,
            fontWeight: "400",
            fontSize: "14px",
            textAlign: "center", // Center text
            lineHeight: "18px",
            userSelect: "none",
            whiteSpace: "normal", // Allow wrapping
          }}
        >
          {isUploading
            ? t("whiteLabel.loading")
            : t("mspRegister.clickToUpload") ||
              "Clique aqui para fazer\nupload do seu logo"}
        </TextRob16FontL>
      </Box>
    </Stack>
  );
};
