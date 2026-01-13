import { Box, Modal, Stack } from "@mui/material";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { useZTheme } from "../../stores/useZTheme";
import { SampleStepper } from "../../components/SampleStepper";
import { useZMspRegisterPage } from "../../stores/useZMspRegisterPage";
import { useTranslation } from "react-i18next";
import { TextRob16Font1S } from "../../components/Text1S";
import { MspTableFilters } from "./MspTable/MspTableFilter";
import { MspTable } from "./MspTable/MspTable";
import { MspModal } from "./MspModal";
import { ModalDeleteMsp } from "./ModalDeleteMsp";
import { useEffect, useState } from "react";
import { ModalUSerNotCreated } from "./ModalUSerNotCreated";
import { ModalDeleteVMsFromMSP } from "./ModalDeleteVMsFromMSP";
import { useBrandMasterResources } from "../../hooks/useBrandMasterResources";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";
import { useVmResource } from "../../hooks/useVmResource";
import { MspFormModal } from "./MspFormModal";

export const MSPRegisterPage = () => {
  const { theme, mode } = useZTheme();
  const {
    activeStep,
    modalOpen,
    mspToBeDeleted,
    setModalOpen,
    setMspToBeDeleted,
    setActiveStep,
    resetAll,
    setIsEditing,
    brandMasterDeleted,
    vmsToBeDeleted,
    setBrandMasterDeleted,
    setVmsToBeDeleted,
  } = useZMspRegisterPage();
  const { t } = useTranslation();
  const { isLoading } = useBrandMasterResources();
  const { isLoadingDeleteVM, deleteVM } = useVmResource();
  const [openModalUserNotCreated, setOpenModalUserNotCreated] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);

  const resetAllStepStates = () => {
    setIsEditing([]);
    setActiveStep(0);
    resetAll();
  };

  const handleCancelAfterDeleteMSP = () => {
    setMspToBeDeleted(null);
    setModalOpen(null);
    setMspToBeDeleted(null);
    setBrandMasterDeleted(null);
    setVmsToBeDeleted([]);
    resetAllStepStates();
  };

  const handleAfterDeleteMSP = async () => {
    await Promise.all(vmsToBeDeleted.map((vm) => deleteVM(vm.idVM)));
    handleCancelAfterDeleteMSP();
  };

  const handleOpenNewMspModal = () => {
    resetAllStepStates();
    setOpenFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenFormModal(false);
    resetAllStepStates();
  };

  const handleFormSuccess = (type: "createdMsp" | "editedMsp") => {
    setModalOpen(type);
  };

  const handleUserNotCreated = () => {
    setOpenModalUserNotCreated(true);
  };

  useEffect(() => {
    return () => {
      resetAllStepStates();
    };
  }, []);

  return (
    <ScreenFullPage
      title={
        <TextRob20Font1MB
          sx={{
            color: theme[mode].primary,
            fontSize: "28px",
            fontWeight: "500",
            lineHeight: "40px",
          }}
        >
          {t("mspRegister.title")}
        </TextRob20Font1MB>
      }
      sxTitleSubTitle={{
        paddingLeft: "40px",
        paddingRight: "40px",
      }}
      sxContainer={{
        paddingLeft: "40px",
        paddingRight: "40px",
        paddingBottom: "40px",
      }}
      subtitle={
        <Box
          sx={{
            maxWidth: "646px",
            "@media (max-width: 660px)": { maxWidth: "136px" },
          }}
        >
          <SampleStepper
            activeStep={activeStep}
            stepsNames={[
              t("mspRegister.stepOneTitle"),
              t("mspRegister.stepTwoTitle"),
            ]}
          />
        </Box>
      }
      //  sx= estilização do componente pai
      // children= elementos do componente
      // className= estilização do componente
      // isLoading= ativa um loaing na tela
      // title= componente do titulo
      // subtitle= componente do subtitulo
      // keepSubtitle = false= mantem o subtitulo no caso de tela mobile ou pequena
      // sxContainer= estilização do componente children
      // sxTitleSubTitle= estilização do componente title e subtitle
    >
      {Boolean(isLoading || isLoadingDeleteVM) && <AbsoluteBackDrop open />}
      <Stack
        sx={{
          width: "100%",
          gap: "26px",
          borderRadius: "16px",
          boxSizing: "border-box",
        }}
      >
        {
          <Stack
            sx={{
              background: theme[mode].mainBackground,
              borderRadius: "16px",
              width: "100%",
              padding: "24px",
              boxSizing: "border-box",
            }}
          >
            <Stack
              sx={{
                gap: "40px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "24px",
                }}
              >
                <TextRob16Font1S
                  sx={{
                    color: theme[mode].black,
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: "24px",
                  }}
                >
                  {t("mspRegister.tableTitle")}
                </TextRob16Font1S>
                <MspTableFilters onNewMsp={handleOpenNewMspModal} />
              </Box>
              <MspTable onEditMsp={() => setOpenFormModal(true)} />
            </Stack>
          </Stack>
        }
      </Stack>
      {modalOpen !== null && (
        <Modal
          open={modalOpen !== null}
          onClose={() => setModalOpen(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            {(modalOpen === "editedMsp" || modalOpen === "createdMsp") && (
              <MspModal
                modalType={modalOpen}
                onClose={() => setModalOpen(null)}
              />
            )}
            {modalOpen === "deletedMsp" && mspToBeDeleted && (
              <ModalDeleteMsp
                mspToDelete={mspToBeDeleted}
                onClose={() => {
                  setModalOpen(null);
                  setMspToBeDeleted(null);
                }}
              />
            )}
          </div>
        </Modal>
      )}
      {openModalUserNotCreated && (
        <ModalUSerNotCreated
          open={openModalUserNotCreated}
          onClose={() => {
            setOpenModalUserNotCreated(false);
            resetAllStepStates();
          }}
        />
      )}
      {Boolean(brandMasterDeleted) && (
        <ModalDeleteVMsFromMSP
          onClose={handleCancelAfterDeleteMSP}
          onConfirm={handleAfterDeleteMSP}
          open={Boolean(brandMasterDeleted)}
          msp={brandMasterDeleted}
          vms={vmsToBeDeleted}
        />
      )}
      <MspFormModal
        open={openFormModal}
        onClose={handleCloseFormModal}
        onSuccess={handleFormSuccess}
        onUserNotCreated={handleUserNotCreated}
      />
    </ScreenFullPage>
  );
};
