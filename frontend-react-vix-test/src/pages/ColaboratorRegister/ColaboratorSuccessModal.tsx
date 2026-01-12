import { Box, Stack } from "@mui/material";
import { useZTheme } from "../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { Btn } from "../../components/Buttons/Btn";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

interface IColaboratorSuccessModalProps {
  modalType: "created" | "edited";
  onClose: () => void;
}

export const ColaboratorSuccessModal = ({
  modalType,
  onClose,
}: IColaboratorSuccessModalProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        backgroundColor: theme[mode].mainBackground,
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "400px",
        width: "90%",
      }}
    >
      <Stack
        sx={{
          alignItems: "center",
          gap: "24px",
        }}
      >
        <CheckCircleOutlineRoundedIcon
          sx={{
            color: theme[mode].ok,
            width: "48px",
            height: "48px",
          }}
        />
        <TextRob20Font1MB
          sx={{
            color: theme[mode].primary,
            fontSize: "20px",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {modalType === "edited"
            ? t("colaboratorRegister.userEdited")
            : t("colaboratorRegister.userCreated")}
        </TextRob20Font1MB>
        <Btn
          onClick={onClose}
          sx={{
            backgroundColor: theme[mode].blue,
            color: "#fff",
            padding: "12px 32px",
            borderRadius: "12px",
            fontWeight: 500,
            fontSize: "14px",
            "&:hover": {
              backgroundColor: theme[mode].blueDark,
            },
          }}
        >
          {t("colaboratorRegister.ok")}
        </Btn>
      </Stack>
    </Box>
  );
};
