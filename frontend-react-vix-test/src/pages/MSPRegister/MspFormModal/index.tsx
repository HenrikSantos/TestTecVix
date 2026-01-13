import { Box, Modal, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { useBrandMasterResources } from "../../../hooks/useBrandMasterResources";
import { SampleStepper } from "../../../components/SampleStepper";
import { TextRob20Font1MB } from "../../../components/Text1MB";
import { MspFormStepOne } from "./MspFormStepOne";
import { MspFormStepTwo } from "./MspFormStepTwo";
import { CloseXIcon } from "../../../icons/CloseXIcon";
import { IconButton } from "@mui/material";
import { api } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";

interface IMspFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (type: "createdMsp" | "editedMsp") => void;
  onUserNotCreated: () => void;
}

export const MspFormModal = ({
  open,
  onClose,
  onSuccess,
  onUserNotCreated,
}: IMspFormModalProps) => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { getAuth } = useAuth();
  const {
    activeStep,
    setActiveStep,
    resetAll,
    enterOnEditing,
    isEditing,
    companyName,
    cnpj,
    phone,
    sector,
    contactEmail,
    cep,
    location,
    countryState,
    city,
    street,
    streetNumber,
    admName,
    admEmail,
    admPhone,
    admPassword,
    mspDomain,
    brandObjectName,
    cityCode,
    district,
    isPoc,
    discountRate,
    minConsumption,
    setShowError,
    setShowErrorPageTwo,
  } = useZMspRegisterPage();

  const { createAnewBrandMaster, editBrandMaster, isLoading, listAllBrands } =
    useBrandMasterResources();
  const { setMspList } = useZMspRegisterPage();

  const isEditMode = enterOnEditing && isEditing.length > 0;
  const mspIdBeingEdited = isEditing[0];

  const handleContinue = () => {
    setActiveStep(1);
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const handleCancel = () => {
    resetAll();
    setShowError(false);
    setShowErrorPageTwo(false);
    setActiveStep(0);
    onClose();
  };

  const createAdminUser = async (idBrandMaster: number) => {
    if (!admEmail || !admName) return null;

    try {
      const auth = await getAuth();
      const response = await api.post({
        url: `/user`,
        auth,
        data: {
          username: admName.toLowerCase().replace(/\s+/g, "."),
          email: admEmail,
          role: "admin",
          password: admPassword,
          fullName: admName,
          userPhoneNumber: admPhone || null,
          idBrandMaster,
          isActive: true,
        },
      });

      if (response.error) {
        return null;
      }

      return response.data;
    } catch {
      return null;
    }
  };

  const handleConfirm = async () => {
    const formData = {
      companyName,
      cnpj,
      phone,
      sector,
      contactEmail,
      cep,
      location,
      countryState,
      city,
      street,
      streetNumber,
      admName,
      admEmail,
      admPhone,
      admPassword,
      brandLogo: brandObjectName,
      position: "admin" as const,
      mspDomain,
      cityCode: cityCode ? Number(cityCode) : undefined,
      district: district || undefined,
      isPoc,
      discountRate,
      minConsumption,
    };

    if (isEditMode && mspIdBeingEdited) {
      const result = await editBrandMaster(mspIdBeingEdited, {
        brandName: companyName,
        cnpj,
        smsContact: phone,
        setorName: sector,
        emailContact: contactEmail,
        cep,
        location,
        state: countryState,
        city,
        street,
        placeNumber: streetNumber,
        brandLogo: brandObjectName,
        cityCode: cityCode ? Number(cityCode) : undefined,
        district: district || undefined,
        isPoc,
        discountRate,
        minConsumption,
        // Admin user fields
        admName,
        admEmail,
        admPhone,
        admPassword,
      });

      if (result?.brandMaster) {
        const listResult = await listAllBrands();
        if (listResult?.result) {
          setMspList(listResult.result);
        }
        toast.success(t("mspRegister.editedMsp"));
        handleCancel();
        onSuccess("editedMsp");
      }
    } else {
      const result = await createAnewBrandMaster(formData);

      if (result?.brandMaster) {
        const newMspId = result.brandMaster.idBrandMaster;

        const userCreated = await createAdminUser(newMspId);

        const listResult = await listAllBrands();
        if (listResult?.result) {
          setMspList(listResult.result);
        }

        toast.success(t("mspRegister.createdMsp"));
        handleCancel();

        if (!userCreated) {
          onUserNotCreated();
        } else {
          onSuccess("createdMsp");
        }
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          backgroundColor: theme[mode].light,
          borderRadius: "16px",
          maxWidth: "80%",
          width: "80%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Header */}
        <Stack
          sx={{
            padding: "24px",
            borderBottom: `1px solid ${theme[mode].grayLight}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextRob20Font1MB
              sx={{
                color: theme[mode].primary,
                fontSize: "24px",
                fontWeight: 500,
              }}
            >
              {isEditMode ? t("mspRegister.editTitle") : t("mspRegister.title")}
            </TextRob20Font1MB>

            <IconButton onClick={handleCancel} size="small">
              <CloseXIcon fill={theme[mode].gray} />
            </IconButton>
          </Box>

          <Box sx={{ marginTop: "16px", width: "40%" }}>
            <SampleStepper
              activeStep={activeStep}
              stepsNames={[
                t("mspRegister.stepOneTitle"),
                t("mspRegister.stepTwoTitle"),
              ]}
            />
          </Box>
        </Stack>

        {/* Content */}
        <Box
          sx={{
            padding: "24px",
            backgroundColor: theme[mode].mainBackground,
            margin: "16px",
            borderRadius: "12px",
          }}
        >
          {activeStep === 0 && (
            <MspFormStepOne
              onContinue={handleContinue}
              onCancel={handleCancel}
            />
          )}

          {activeStep === 1 && (
            <MspFormStepTwo
              onConfirm={handleConfirm}
              onBack={handleBack}
              isLoading={isLoading}
              isEditMode={isEditMode}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};
