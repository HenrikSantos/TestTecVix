import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { InputLabelAndFeedback } from "../../../components/Inputs/InputLabelAndFeedback";
import { DropDrownLabel } from "../../../components/Inputs/DropDrownLabel";
import { InputLabelTooltip } from "../../../components/Inputs/InputLabelTooltip";
import { CheckboxLabel } from "../../../components/CheckboxLabel";
import { Btn } from "../../../components/Buttons/Btn";
import { TextRob16Font1S } from "../../../components/Text1S";
import { maskCNPJ } from "../../../utils/maskCNPJ";
import { maskPhone } from "../../../utils/maskPhone";
import { isValidCNPJ } from "../../../utils/isValidCNPJ";
import { isValidEmail } from "../../../utils/isValidEmail";
import { PencilIcon } from "../../../icons/PencilIcon";
import { useState, useCallback, useMemo } from "react";

interface IMspFormStepOneProps {
  onContinue: () => void;
  onCancel: () => void;
}

const SECTOR_KEYS = [
  "Telecom",
  "Technology",
  "Financial",
  "Healthcare",
  "Education",
  "Retail",
  "Other",
] as const;

export const MspFormStepOne = ({
  onContinue,
  onCancel,
}: IMspFormStepOneProps) => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const {
    companyName,
    setCompanyName,
    cnpj,
    setCnpj,
    phone,
    setPhone,
    sector,
    setSector,
    contactEmail,
    setContactEmail,
    minConsumption,
    setMinConsumption,
    discountRate,
    setDiscountRate,
    isPoc,
    setIsPoc,
    showError,
    setShowError,
    setCep,
    setCity,
    location,
    setLocation,
    setCountryState,
    setStreet,
    setStreetNumber,
    setDistrict,
  } = useZMspRegisterPage();

  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false);

  const sectorOptions = useMemo(
    () =>
      SECTOR_KEYS.map((key) => ({
        label: t(`mspRegister.sector${key}`),
        value: key,
      })),
    [t],
  );

  const fetchAddressByCnpj = useCallback(
    async (cnpjValue: string) => {
      const cleanedCnpj = cnpjValue.replace(/\D/g, "");
      if (cleanedCnpj.length !== 14) return;

      setIsLoadingCnpj(true);
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cnpj/v1/${cleanedCnpj}`,
        );
        const data = await response.json();

        if (!data.message) {
          setCep(data.cep || "");
          setCity(data.municipio || "");
          setCountryState(data.uf || "");
          setStreet(data.logradouro || "");
          setStreetNumber(data.numero || "");
          setDistrict(data.bairro || "");
          setLocation("Brasil");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do CNPJ:", error);
      } finally {
        setIsLoadingCnpj(false);
      }
    },
    [
      setCep,
      setCity,
      setCountryState,
      setStreet,
      setStreetNumber,
      setDistrict,
      setLocation,
    ],
  );

  const handleCnpjChange = (value: string) => {
    const maskedValue = maskCNPJ(value);
    setCnpj(maskedValue);

    const cleanedCnpj = maskedValue.replace(/\D/g, "");
    if (cleanedCnpj.length === 14 && isValidCNPJ(maskedValue)) {
      fetchAddressByCnpj(cleanedCnpj);
    }
  };

  const validateStepOne = (): boolean => {
    if (!companyName.trim()) return false;
    if (!cnpj || !isValidCNPJ(cnpj)) return false;
    if (!sector) return false;
    if (!contactEmail || !isValidEmail(contactEmail)) return false;
    return true;
  };

  const handleContinue = () => {
    if (!validateStepOne()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onContinue();
  };

  const getSectorValue = () => {
    if (!sector) return null;
    const found = sectorOptions.find((opt) => opt.value === sector);
    return found || { label: sector, value: sector };
  };

  const buttonStyle = {
    padding: "14px 32px",
    borderRadius: "12px",
    fontWeight: 500,
    width: "100%",
    maxWidth: "300px",
    minHeight: "52px",
  };

  return (
    <Stack gap="24px">
      <TextRob16Font1S
        sx={{
          color: theme[mode].black,
          fontSize: "16px",
          fontWeight: 500,
          lineHeight: "24px",
        }}
      >
        {t("mspRegister.companyInfos")}
      </TextRob16Font1S>

      {/* Linha 1: Nome, Location, CNPJ */}
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
            label={
              <>
                {t("mspRegister.companyName")}{" "}
                <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                  {t("mspRegister.required")}
                </span>
              </>
            }
            value={companyName}
            onChange={setCompanyName}
            placeholder="Vituax"
            icon={<PencilIcon fill={theme[mode].gray} />}
            errorMessage={
              showError && !companyName.trim()
                ? t("mspRegister.fillField")
                : null
            }
          />
        </Box>

        <Box sx={{ gridColumn: "span 1" }}>
          <InputLabelAndFeedback
            label={t("mspRegister.location") || "País"}
            value={location}
            onChange={setLocation}
            placeholder="Brasil"
            icon={<PencilIcon fill={theme[mode].gray} />}
          />
        </Box>

        <InputLabelAndFeedback
          label={
            <>
              {t("mspRegister.cnpj")}{" "}
              <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                {t("mspRegister.required")}
              </span>
            </>
          }
          value={cnpj}
          onChange={handleCnpjChange}
          placeholder="00.000.000/0001-00"
          icon={<PencilIcon fill={theme[mode].gray} />}
          disabled={isLoadingCnpj}
          errorMessage={
            showError && (!cnpj || !isValidCNPJ(cnpj))
              ? t("mspRegister.cnpjAlertMessage")
              : null
          }
        />
      </Box>

      {/* Linha 2: Setor, E-mail de contato e Telefone */}
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
          <DropDrownLabel
            label={
              <>
                {t("mspRegister.sector")}{" "}
                <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                  {t("mspRegister.required")}
                </span>
              </>
            }
            data={sectorOptions}
            value={getSectorValue()}
            onChange={(value) => setSector((value?.value as string) || "")}
            errorMessage={
              showError && !sector ? t("mspRegister.fillField") : null
            }
          />
        </Box>

        <Box sx={{ gridColumn: "span 1" }}>
          <InputLabelAndFeedback
            label={
              <>
                {t("mspRegister.contactEmail")}{" "}
                <span style={{ color: theme[mode].gray, fontSize: "12px" }}>
                  {t("mspRegister.required")}
                </span>
              </>
            }
            value={contactEmail}
            onChange={setContactEmail}
            placeholder="vituax@gmail.com"
            icon={<PencilIcon fill={theme[mode].gray} />}
            errorMessage={
              showError && (!contactEmail || !isValidEmail(contactEmail))
                ? t("mspRegister.emailAlertMessage")
                : null
            }
          />
        </Box>

        <InputLabelAndFeedback
          label={t("mspRegister.phone")}
          value={phone}
          onChange={(value) => setPhone(maskPhone(value))}
          placeholder="(00) 00000-0000"
          icon={<PencilIcon fill={theme[mode].gray} />}
        />
      </Box>

      {/* Linha 3: Consumo mínimo, Desconto, POC */}
      <Box
        sx={{
          width: "100%",
          height: "1px",
          backgroundColor: theme[mode].tertiary,
          margin: "16px 0",
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          alignItems: "flex-end",
          "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        <InputLabelTooltip
          label={t("mspRegister.minConsumption")}
          value={String(minConsumption || "")}
          onChange={(value) => {
            const numValue = value.replace(/\D/g, "");
            setMinConsumption(Number(numValue) || 0);
          }}
          placeholder="0"
        />

        <InputLabelTooltip
          label={t("mspRegister.discountPercentage")}
          value={String(discountRate || "")}
          onChange={(value) => {
            const numValue = value.replace(/\D/g, "");
            const num = Math.min(Number(numValue) || 0, 100);
            setDiscountRate(num);
          }}
          placeholder="0"
          endText="%"
        />

        <Stack
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            height: "64px",
            paddingTop: "24px",
          }}
        >
          <CheckboxLabel
            label={t("mspRegister.isPoc")}
            checked={isPoc}
            handleChange={() => setIsPoc(!isPoc)}
          />
        </Stack>
      </Box>

      {/* Botões */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "24px",
          marginTop: "16px",
          "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        <Box sx={{ gridColumn: "span 1" }}>
          <Btn
            onClick={handleContinue}
            sx={{
              ...buttonStyle,
              maxWidth: "none",
              backgroundColor: "#4b5cb7",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#3d4a96",
              },
            }}
          >
            {t("mspRegister.continue") || "Continuar"}
          </Btn>
        </Box>

        <Box sx={{ gridColumn: "span 1" }}>
          <Btn
            onClick={onCancel}
            sx={{
              ...buttonStyle,
              maxWidth: "none",
              backgroundColor: "transparent",
              color: theme[mode].primary,
              border: `1px solid ${theme[mode].gray}`,
              "&:hover": {
                backgroundColor: theme[mode].grayLight,
              },
            }}
          >
            {t("mspRegister.cancel")}
          </Btn>
        </Box>
      </Box>
    </Stack>
  );
};
