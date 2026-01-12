import { Box, Modal, Stack } from "@mui/material";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { useZTheme } from "../../stores/useZTheme";
import { useZColaboratorRegisterPage } from "../../stores/useZColaboratorRegisterPage";
import { useTranslation } from "react-i18next";
import { TextRob16Font1S } from "../../components/Text1S";
import { ColaboratorTableFilters } from "./ColaboratorTable/ColaboratorTableFilter";
import { ColaboratorTable } from "./ColaboratorTable/ColaboratorTable";
import { ColaboratorSuccessModal } from "./ColaboratorSuccessModal";
import { ModalDeleteColaborator } from "./ModalDeleteColaborator";
import { useEffect, useState } from "react";
import { useBrandMasterResources } from "../../hooks/useBrandMasterResources";
import { useEmployeeResources } from "../../hooks/useEmployeeResources";
import { AbsoluteBackDrop } from "../../components/AbsoluteBackDrop";
import { ColaboratorFormModal } from "./ColaboratorFormModal";
import { ColaboratorCreateForm } from "./ColaboratorCreateForm";

export const ColaboratorRegisterPage = () => {
  const { theme, mode } = useZTheme();
  const {
    modalOpen,
    employeeToBeDeleted,
    setModalOpen,
    setEmployeeToBeDeleted,
    resetAll,
    setIsEditing,
    setCompanyOptions,
    setEmployeeList,
    userFilter,
  } = useZColaboratorRegisterPage();
  const { t } = useTranslation();
  const { isLoading: isLoadingBrands, listAllBrands } =
    useBrandMasterResources();
  const {
    isLoading: isLoadingEmployees,
    listAllEmployees,
    deleteEmployee,
  } = useEmployeeResources();
  const [openEditModal, setOpenEditModal] = useState(false);

  const resetAllStates = () => {
    setIsEditing([]);
    resetAll();
  };

  const handleCancelDelete = () => {
    setEmployeeToBeDeleted(null);
    setModalOpen(null);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToBeDeleted) return;

    const result = await deleteEmployee(employeeToBeDeleted.idUser);
    if (result) {
      await fetchEmployees();
      setModalOpen("deleted");
    }
    setEmployeeToBeDeleted(null);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    resetAllStates();
  };

  const handleCreateSuccess = () => {
    setModalOpen("created");
    fetchEmployees();
  };

  const handleEditSuccess = () => {
    setModalOpen("edited");
    fetchEmployees();
  };

  const fetchEmployees = async () => {
    const response = await listAllEmployees({
      search: userFilter || undefined,
    });
    setEmployeeList(response.result);
  };

  const fetchCompanies = async () => {
    const response = await listAllBrands();
    setCompanyOptions(response.result);
  };

  useEffect(() => {
    fetchCompanies();
    fetchEmployees();

    return () => {
      resetAllStates();
    };
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [userFilter]);

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
          {t("colaboratorRegister.title")}
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
        <TextRob16Font1S
          sx={{
            color: theme[mode].gray,
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {t("colaboratorRegister.subtitle")}
        </TextRob16Font1S>
      }
    >
      {Boolean(isLoadingBrands || isLoadingEmployees) && (
        <AbsoluteBackDrop open />
      )}
      <Stack
        sx={{
          width: "100%",
          gap: "26px",
          borderRadius: "16px",
          boxSizing: "border-box",
        }}
      >
        {/* Formulario de criacao inline */}
        <ColaboratorCreateForm onSuccess={handleCreateSuccess} />

        {/* Tabela de listagem */}
        <Stack
          sx={{
            background: theme[mode].mainBackground,
            borderRadius: "16px",
            width: "100%",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <Stack sx={{ gap: "40px" }}>
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
                {t("colaboratorRegister.tableTitle")}
              </TextRob16Font1S>
              <ColaboratorTableFilters />
            </Box>
            <ColaboratorTable onEditEmployee={() => setOpenEditModal(true)} />
          </Stack>
        </Stack>
      </Stack>

      {modalOpen !== null && modalOpen !== "deleted" && (
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
            {(modalOpen === "edited" || modalOpen === "created") && (
              <ColaboratorSuccessModal
                modalType={modalOpen}
                onClose={() => setModalOpen(null)}
              />
            )}
          </div>
        </Modal>
      )}

      {employeeToBeDeleted && (
        <ModalDeleteColaborator
          open={Boolean(employeeToBeDeleted)}
          employee={employeeToBeDeleted}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      <ColaboratorFormModal
        open={openEditModal}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </ScreenFullPage>
  );
};
