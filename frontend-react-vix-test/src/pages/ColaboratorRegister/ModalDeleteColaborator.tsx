import { Box, Modal, Stack } from "@mui/material";
import { useZTheme } from "../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { TextRob16Font1S } from "../../components/Text1S";
import { Btn } from "../../components/Buttons/Btn";
import { IUserResponse } from "../../types/userTypes";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface IModalDeleteColaboratorProps {
  open: boolean;
  employee: IUserResponse;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalDeleteColaborator = ({
  open,
  employee,
  onClose,
  onConfirm,
}: IModalDeleteColaboratorProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
          <DeleteForeverIcon
            sx={{
              color: theme[mode].danger,
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
            {t("colaboratorRegister.deleteEmployee") || "Excluir Colaborador"}
          </TextRob20Font1MB>
          <TextRob16Font1S
            sx={{
              color: theme[mode].gray,
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {t("colaboratorRegister.areYouSure", {
              username: employee.fullName || employee.username,
            })}
          </TextRob16Font1S>
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Btn
              onClick={onClose}
              sx={{
                backgroundColor: "transparent",
                color: theme[mode].primary,
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "14px",
                border: `1px solid ${theme[mode].grayLight}`,
                "&:hover": {
                  backgroundColor: theme[mode].grayLight,
                },
              }}
            >
              {t("colaboratorRegister.back")}
            </Btn>
            <Btn
              onClick={onConfirm}
              sx={{
                backgroundColor: theme[mode].danger,
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "14px",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              {t("colaboratorRegister.deleteEmployee") || "Excluir"}
            </Btn>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};
