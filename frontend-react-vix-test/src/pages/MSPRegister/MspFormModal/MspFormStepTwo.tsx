import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { InputLabelAndFeedback } from "../../../components/Inputs/InputLabelAndFeedback";
import { InputUploadLabelTooltip } from "../../../components/Inputs/InputUploadLabelTooltip";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob16Font1S } from "../../../components/Text1S";
import { TextRob16FontL } from "../../../components/TextL";
import { maskPhone } from "../../../utils/maskPhone";
import { isValidEmail } from "../../../utils/isValidEmail";
import { PencilIcon } from "../../../icons/PencilIcon";
import { useEffect } from "react";

interface IMspFormStepTwoProps {
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
}

const generatePassword = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const MspFormStepTwo = ({
  onConfirm,
  onBack,
  isLoading,
  isEditMode,
}: IMspFormStepTwoProps) => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const {
    mspDomain,
    setMSPDomain,
    admName,
    setAdmName,
    admEmail,
    setAdmEmail,
    admPhone,
    setAdmPhone,
    admPassword,
    setAdmPassword,
    brandLogoUrl,
    setBrandLogo,
    showErrorPageTwo,
    setShowErrorPageTwo,
  } = useZMspRegisterPage();

  useEffect(() => {
    if (!admPassword) {
      setAdmPassword(generatePassword());
    }
  }, [admPassword, setAdmPassword]);

  const validateStepTwo = (): boolean => {
    if (!mspDomain.trim()) return false;
    // Na edição, os campos do admin já existem, não são obrigatórios
    if (!isEditMode) {
      if (!admName.trim()) return false;
      if (!admEmail || !isValidEmail(admEmail)) return false;
    }
    return true;
  };

  const handleConfirm = () => {
    if (!validateStepTwo()) {
      setShowErrorPageTwo(true);
      return;
    }
    setShowErrorPageTwo(false);
    onConfirm();
  };

  const handleUpload = ({
    url,
    objectName,
  }: {
    url: string;
    objectName: string;
  }) => {
    setBrandLogo({ brandLogoUrl: url, brandObjectName: objectName });
  };

  const handleRemoveLogo = () => {
    setBrandLogo({ brandLogoUrl: "", brandObjectName: "" });
  };

  const handleClearStepTwo = () => {
    setMSPDomain("");
    setAdmName("");
    setAdmEmail("");
    setAdmPhone("");
    setAdmPassword(generatePassword());
    setBrandLogo({ brandLogoUrl: "", brandObjectName: "" });
    setShowErrorPageTwo(false);
  };

  return (
    <Stack gap="24px">
      {/* Seção Domínio */}
      <Stack gap="16px">
        <TextRob16Font1S
          sx={{
            color: theme[mode].black,
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "24px",
          }}
        >
          {t("mspRegister.mspDomain")}
        </TextRob16Font1S>

        <TextRob16FontL
          sx={{
            color: theme[mode].gray,
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {t("mspRegister.domain")}{" "}
          <span style={{ fontSize: "12px" }}>{t("mspRegister.required")}</span>
        </TextRob16FontL>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            "@media (max-width: 900px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          <Box sx={{ gridColumn: "span 1" }}>
            <InputLabelAndFeedback
              value={mspDomain}
              onChange={setMSPDomain}
              placeholder="xx.xxx.xxx"
              icon={<PencilIcon fill={theme[mode].gray} />}
              errorMessage={
                showErrorPageTwo && !mspDomain.trim()
                  ? t("mspRegister.fillField")
                  : null
              }
            />
          </Box>
        </Box>
      </Stack>

      {/* Seção Administrador */}
      <Stack gap="16px">
        <TextRob16Font1S
          sx={{
            color: theme[mode].black,
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "24px",
          }}
        >
          {t("mspRegister.principalAdmin")}
        </TextRob16Font1S>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            "@media (max-width: 768px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          <Box sx={{ gridColumn: "span 1" }}>
            <InputLabelAndFeedback
              label={
                <>
                  {t("mspRegister.completeName")}{" "}
                  <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                    {t("mspRegister.required")}
                  </span>
                </>
              }
              value={admName}
              onChange={setAdmName}
              placeholder={t("mspRegister.completeNamePlaceholder")}
              icon={<PencilIcon fill={theme[mode].gray} />}
              errorMessage={
                showErrorPageTwo && !admName.trim()
                  ? t("mspRegister.fillField")
                  : null
              }
            />
          </Box>

          <Box sx={{ gridColumn: "span 1" }}>
            <InputLabelAndFeedback
              label={
                <>
                  {t("mspRegister.email")}{" "}
                  <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                    {t("mspRegister.required")}
                  </span>
                </>
              }
              value={admEmail}
              onChange={setAdmEmail}
              placeholder={t("mspRegister.emailPlaceholder")}
              icon={<PencilIcon fill={theme[mode].gray} />}
              errorMessage={
                showErrorPageTwo && (!admEmail || !isValidEmail(admEmail))
                  ? t("mspRegister.emailAlertMessage")
                  : null
              }
            />
          </Box>
        </Box>

        {/* Linha 2: Telefone, Cargo, Senha, Nome de Usuário */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            "@media (max-width: 1200px)": {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
            "@media (max-width: 768px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          <InputLabelAndFeedback
            label={t("mspRegister.phone")}
            value={admPhone}
            onChange={(value) => setAdmPhone(maskPhone(value))}
            placeholder="(00) 00000-0000"
            icon={<PencilIcon fill={theme[mode].gray} />}
          />

          <InputLabelAndFeedback
            label={t("mspRegister.position")}
            value="Administrador"
            onChange={() => {}}
            placeholder="Administrador"
            disabled
          />

          <Stack gap="8px">
            <InputLabelAndFeedback
              label={
                <>
                  {t("mspRegister.initialPassword")}{" "}
                  <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                    {t("mspRegister.required")}
                  </span>
                </>
              }
              value={admPassword}
              onChange={setAdmPassword}
              placeholder={t("mspRegister.initialPasswordPlaceholder")}
              type="password"
            />
          </Stack>

          <InputLabelAndFeedback
            label={t("mspRegister.username") || "Nome de Usuário"}
            value={admName ? admName.toLowerCase().replace(/\s+/g, ".") : ""}
            onChange={() => {}}
            placeholder="nome.usuario"
            disabled
          />
        </Box>
      </Stack>

      {/* Seção Logo */}
      <Box
        sx={{
          width: "100%",
          height: "1px",
          backgroundColor: theme[mode].tertiary,
          margin: "16px 0",
        }}
      />
      <Stack gap="16px">
        <TextRob16Font1S
          sx={{
            color: theme[mode].black,
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "24px",
          }}
        >
          {t("mspRegister.companyLogo")}
        </TextRob16Font1S>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            alignItems: "flex-start", // Top align for different heights
            "@media (max-width: 768px)": {
              gridTemplateColumns: "1fr",
            },
          }}
        >
          {/* Área de upload */}
          <Box sx={{ gridColumn: "span 1" }}>
            <InputUploadLabelTooltip onUploaded={handleUpload} />
          </Box>

          {/* Preview e Links */}
          <Box
            sx={{
              gridColumn: "span 1",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
              {/* Preview do logo */}
              {brandLogoUrl && (
                <Box
                  sx={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: theme[mode].grayLight,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={brandLogoUrl}
                    alt="Logo preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}

              {/* Links de ação */}
              <Stack gap="4px">
                {brandLogoUrl && (
                  <>
                    <Box
                      sx={{
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                      }}
                      onClick={() => {
                        const input = document.querySelector(
                          'input[type="file"]',
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      <TextRob16FontL
                        sx={{
                          color: theme[mode].blue,
                          fontSize: "12px",
                          textDecoration: "underline",
                        }}
                      >
                        {t("mspRegister.changeLogo") || "Alterar logo"}
                      </TextRob16FontL>
                    </Box>

                    <Box
                      sx={{
                        cursor: "pointer",
                        "&:hover": { opacity: 0.8 },
                      }}
                      onClick={handleRemoveLogo}
                    >
                      <TextRob16FontL
                        sx={{
                          color: theme[mode].blue,
                          fontSize: "12px",
                          textDecoration: "underline",
                        }}
                      >
                        {t("mspRegister.removeLogo") || "Remover logo"}
                      </TextRob16FontL>
                    </Box>
                  </>
                )}
              </Stack>
            </Box>

            {/* Informações da imagem */}
            {brandLogoUrl && (
              <Stack gap="2px" sx={{ marginTop: "8px" }}>
                <TextRob16FontL
                  sx={{
                    color: theme[mode].gray,
                    fontSize: "11px",
                  }}
                >
                  • Padrão: 165x50px
                </TextRob16FontL>
                <TextRob16FontL
                  sx={{
                    color: theme[mode].gray,
                    fontSize: "11px",
                  }}
                >
                  • Tamanho: 50mb
                </TextRob16FontL>
                <TextRob16FontL
                  sx={{
                    color: theme[mode].gray,
                    fontSize: "11px",
                  }}
                >
                  • Formatos: .svg .png .gif .webp
                </TextRob16FontL>
              </Stack>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "1px",
            backgroundColor: theme[mode].tertiary,
            margin: "16px 0",
          }}
        />
      </Stack>

      {/* Botões */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginTop: "16px",
          alignItems: "center",
          "@media (max-width: 768px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        <Box sx={{ gridColumn: "span 1" }}>
          <Btn
            onClick={handleConfirm}
            disabled={isLoading}
            sx={{
              backgroundColor: "#4b5cb7",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: "12px",
              fontWeight: 500,
              width: "100%",
              maxWidth: "none",
              minHeight: "52px",
              "&:hover": {
                backgroundColor: "#3d4a96",
              },
            }}
          >
            {isEditMode
              ? t("mspRegister.confirmEdit")
              : t("mspRegister.confirm")}
          </Btn>
        </Box>

        <Box sx={{ gridColumn: "span 1" }}>
          <Btn
            onClick={onBack}
            disabled={isLoading}
            sx={{
              backgroundColor: "transparent",
              color: theme[mode].primary,
              padding: "14px 32px",
              borderRadius: "12px",
              border: `1px solid ${theme[mode].gray}`,
              fontWeight: 500,
              width: "100%",
              maxWidth: "none",
              minHeight: "52px",
              "&:hover": {
                backgroundColor: theme[mode].grayLight,
              },
            }}
          >
            {t("mspRegister.back")}
          </Btn>
        </Box>

        <Box
          sx={{
            gridColumn: "span 2",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Btn
            onClick={handleClearStepTwo}
            sx={{
              backgroundColor: "transparent",
              color: theme[mode].primary,
              padding: "14px 32px",
              borderRadius: "12px",
              fontWeight: 500,
              width: "auto",
              maxWidth: "none",
              minHeight: "52px",
              border: "none",
              "&:hover": {
                opacity: 0.8,
                backgroundColor: "transparent",
              },
            }}
          >
            <TextRob16FontL
              sx={{
                color: theme[mode].primary,
                fontSize: "14px",
                textDecoration: "underline",
              }}
            >
              {t("mspRegister.clear")}
            </TextRob16FontL>
          </Btn>
        </Box>
      </Box>
    </Stack>
  );
};
