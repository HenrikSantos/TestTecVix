import { Box, IconButton, Modal, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { useZColaboratorRegisterPage } from "../../../stores/useZColaboratorRegisterPage";
import { useEmployeeResources } from "../../../hooks/useEmployeeResources";
import { TextRob20Font1MB } from "../../../components/Text1MB";
import { CloseXIcon } from "../../../icons/CloseXIcon";
import { InputLabelAndFeedback } from "../../../components/Inputs/InputLabelAndFeedback";
import { DropDrownLabel } from "../../../components/Inputs/DropDrownLabel";
import { Btn } from "../../../components/Buttons/Btn";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { maskPhone } from "../../../utils/maskPhone";
import { isValidEmail } from "../../../utils/isValidEmail";

interface IColaboratorFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ColaboratorFormModal = ({
  open,
  onClose,
  onSuccess,
}: IColaboratorFormModalProps) => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const {
    isEditing,
    fullName,
    email,
    phone,
    username,
    password,
    confirmPassword,
    position,
    department,
    userPermission,
    status,
    companyId,
    hiringDate,
    showError,
    companyOptions,
    setFullName,
    setEmail,
    setPhone,
    setUsername,
    setPassword,
    setConfirmPassword,
    setPosition,
    setDepartment,
    setUserPermission,
    setStatus,
    setCompanyId,
    setHiringDate,
    setShowError,
    resetAll,
  } = useZColaboratorRegisterPage();

  const { updateEmployee, isLoading } = useEmployeeResources();

  const employeeIdBeingEdited = isEditing[0];

  const permissionOptions = useMemo(
    () => [
      { label: t("colaboratorRegister.admin"), value: "admin" },
      { label: t("colaboratorRegister.manager"), value: "manager" },
      { label: t("colaboratorRegister.member"), value: "member" },
    ],
    [t],
  );

  const statusOptions = useMemo(
    () => [
      { label: t("colaboratorRegister.active"), value: true },
      { label: t("colaboratorRegister.inactive"), value: false },
    ],
    [t],
  );

  const companyDropdownOptions = useMemo(() => {
    return companyOptions.map((company) => ({
      label: company.brandName || "",
      value: company.idBrandMaster,
    }));
  }, [companyOptions]);

  const selectedCompany = useMemo(() => {
    if (!companyId) return null;
    const company = companyOptions.find((c) => c.idBrandMaster === companyId);
    return company
      ? { label: company.brandName || "", value: company.idBrandMaster }
      : null;
  }, [companyId, companyOptions]);

  const selectedPermission = useMemo(() => {
    return (
      permissionOptions.find((p) => p.value === userPermission) ||
      permissionOptions[2]
    );
  }, [userPermission, permissionOptions]);

  const selectedStatus = useMemo(() => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  }, [status, statusOptions]);

  const validateForm = (): boolean => {
    if (!fullName.trim()) return false;
    if (!email || !isValidEmail(email)) return false;
    if (!username.trim()) return false;
    if (password && password !== confirmPassword) return false;
    if (!companyId) return false;
    return true;
  };

  const handleCancel = () => {
    resetAll();
    setShowError(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!validateForm()) {
      setShowError(true);
      return;
    }

    if (!employeeIdBeingEdited) return;

    const result = await updateEmployee(employeeIdBeingEdited, {
      username,
      email,
      fullName,
      userPhoneNumber: phone || undefined,
      role: userPermission,
      idBrandMaster: companyId!,
      isActive: status,
      field: position || undefined,
      department: department || undefined,
      contractDate: hiringDate || undefined,
      ...(password && { password }),
    });

    if (result) {
      toast.success(t("colaboratorRegister.userEdited"));
      handleCancel();
      onSuccess();
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
          width: "60%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          "@media (max-width: 1200px)": {
            width: "80%",
          },
          "@media (max-width: 900px)": {
            width: "95%",
          },
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
              {t("colaboratorRegister.editEmployee") || "Editar Colaborador"}
            </TextRob20Font1MB>

            <IconButton onClick={handleCancel} size="small">
              <CloseXIcon fill={theme[mode].gray} />
            </IconButton>
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px 24px",
              "@media (max-width: 900px)": {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
              "@media (max-width: 600px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            {/* Row 1 */}
            <InputLabelAndFeedback
              label={t("colaboratorRegister.completeName")}
              sideLabel={t("colaboratorRegister.required")}
              value={fullName}
              onChange={setFullName}
              placeholder={t("colaboratorRegister.completeNamePlaceholder")}
              errorMessage={
                showError && !fullName.trim()
                  ? t("colaboratorRegister.fillFields")
                  : null
              }
            />
            <InputLabelAndFeedback
              label={t("colaboratorRegister.email")}
              sideLabel={t("colaboratorRegister.required")}
              value={email}
              onChange={setEmail}
              placeholder={t("colaboratorRegister.emailPlaceholder")}
              errorMessage={
                showError && (!email || !isValidEmail(email))
                  ? t("colaboratorRegister.emailAlertMessage")
                  : null
              }
            />
            <InputLabelAndFeedback
              label={t("colaboratorRegister.phone")}
              value={phone}
              onChange={(value) => setPhone(maskPhone(value))}
              placeholder="(00) 00000-0000"
            />
            <InputLabelAndFeedback
              label={t("colaboratorRegister.username")}
              sideLabel={t("colaboratorRegister.required")}
              value={username}
              onChange={setUsername}
              placeholder="jose.silva"
              errorMessage={
                showError && !username.trim()
                  ? t("colaboratorRegister.fillFields")
                  : null
              }
            />

            {/* Row 2 */}
            <InputLabelAndFeedback
              label={t("colaboratorRegister.password")}
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="********"
            />
            <InputLabelAndFeedback
              label={t("colaboratorRegister.confirmPassword")}
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
              placeholder="********"
              errorMessage={
                showError && password && password !== confirmPassword
                  ? t("colaboratorRegister.dontMatch")
                  : null
              }
            />
            <InputLabelAndFeedback
              label={t("colaboratorRegister.position")}
              value={position}
              onChange={setPosition}
              placeholder={t("colaboratorRegister.positionPlaceholder")}
            />
            <InputLabelAndFeedback
              label={t("colaboratorRegister.department")}
              value={department}
              onChange={setDepartment}
              placeholder={t("colaboratorRegister.departmentPlaceholder")}
            />

            {/* Row 3 */}
            <DropDrownLabel
              label={t("colaboratorRegister.permission")}
              sideLabel={t("colaboratorRegister.required")}
              data={permissionOptions}
              value={selectedPermission}
              onChange={(value) =>
                setUserPermission(
                  (value?.value as "admin" | "manager" | "member") || "member",
                )
              }
            />
            <DropDrownLabel
              label={t("colaboratorRegister.status")}
              sideLabel={t("colaboratorRegister.required")}
              data={statusOptions}
              value={selectedStatus}
              onChange={(value) => setStatus(value?.value as boolean)}
            />
            <DropDrownLabel
              label={t("colaboratorRegister.companyName")}
              sideLabel={t("colaboratorRegister.required")}
              data={companyDropdownOptions}
              value={selectedCompany}
              onChange={(value) =>
                setCompanyId((value?.value as number | null) || null)
              }
              errorMessage={
                showError && !companyId
                  ? t("colaboratorRegister.fillFields")
                  : null
              }
            />
            <InputLabelAndFeedback
              label={t("colaboratorRegister.hiringDate")}
              value={hiringDate}
              onChange={setHiringDate}
              type="date"
            />
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              marginTop: "32px",
              flexWrap: "wrap",
            }}
          >
            <Btn
              onClick={handleCancel}
              sx={{
                backgroundColor: "transparent",
                color: theme[mode].primary,
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                minHeight: "44px",
                border: `1px solid ${theme[mode].grayLight}`,
                "&:hover": {
                  backgroundColor: theme[mode].grayLight,
                },
              }}
            >
              {t("colaboratorRegister.cancel")}
            </Btn>
            <Btn
              onClick={handleConfirm}
              disabled={isLoading}
              sx={{
                backgroundColor: theme[mode].blue,
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                minHeight: "44px",
                "&:hover": {
                  backgroundColor: theme[mode].blueDark,
                },
                "&:disabled": {
                  opacity: 0.5,
                },
              }}
            >
              {t("colaboratorRegister.save")}
            </Btn>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
