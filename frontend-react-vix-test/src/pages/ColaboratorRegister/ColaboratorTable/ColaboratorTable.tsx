import { Fragment } from "react";
import { useZTheme } from "../../../stores/useZTheme";
import { Box, IconButton, Stack } from "@mui/material";
import { ImgFromDB } from "../../../components/ImgFromDB";
import { TextRob14Font1Xs } from "../../../components/Text1Xs";
import { TextRob12Font2Xs } from "../../../components/Text2Xs";
import { useTranslation } from "react-i18next";
import { PencilCicleIcon } from "../../../icons/PencilCicleIcon";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useZUserProfile } from "../../../stores/useZUserProfile";
import { useZColaboratorRegisterPage } from "../../../stores/useZColaboratorRegisterPage";
import moment from "moment";

interface IColaboratorTableProps {
  onEditEmployee: () => void;
}

export const ColaboratorTable = ({
  onEditEmployee,
}: IColaboratorTableProps) => {
  const { theme, mode } = useZTheme();
  const { t } = useTranslation();
  const {
    employeeList,
    setIsEditing,
    setEnterOnEditing,
    setFullName,
    setEmail,
    setPhone,
    setUsername,
    setPosition,
    setDepartment,
    setUserPermission,
    setStatus,
    setCompanyId,
    setCompanyName,
    setHiringDate,
    setEmployeeToBeDeleted,
    setProfileImgUrl,
    userFilter,
    companyFilterText,
  } = useZColaboratorRegisterPage();

  const { role } = useZUserProfile();

  const handleEdit = (idUser: string) => {
    setEnterOnEditing(true);
    setIsEditing([idUser]);

    const employee = employeeList.find((e) => e.idUser === idUser);
    if (!employee) return;

    setFullName(employee.fullName || "");
    setEmail(employee.email || "");
    setPhone(employee.userPhoneNumber || "");
    setUsername(employee.username || "");
    setPosition(employee.field || "");
    setDepartment(employee.department || "");
    setUserPermission(employee.role || "member");
    setStatus(employee.isActive);
    setCompanyId(employee.idBrandMaster);
    setCompanyName(employee.brandMaster?.brandName || "");
    setHiringDate(
      employee.contractDate
        ? moment(employee.contractDate).format("YYYY-MM-DD")
        : "",
    );
    setProfileImgUrl(employee.profileImgUrl || "");

    onEditEmployee();
  };

  const handleDelete = (idUser: string) => {
    const employee = employeeList.find((e) => e.idUser === idUser);
    if (employee) {
      setEmployeeToBeDeleted(employee);
    }
  };

  const filteredEmployees = employeeList.filter((employee) => {
    const companySearchLower = companyFilterText.toLowerCase();
    const matchesCompany =
      !companyFilterText ||
      employee.brandMaster?.brandName
        ?.toLowerCase()
        .includes(companySearchLower);

    const searchLower = userFilter.toLowerCase();
    const matchesSearch =
      !userFilter ||
      employee.username?.toLowerCase().includes(searchLower) ||
      employee.email?.toLowerCase().includes(searchLower) ||
      employee.fullName?.toLowerCase().includes(searchLower);

    return matchesCompany && matchesSearch;
  });

  return (
    <Stack
      sx={{
        width: "100%",
        maxHeight: "540px",
        overflow: "auto",
        gap: "16px",
      }}
    >
      {filteredEmployees.map((employee, index) => (
        <Fragment key={employee.idUser}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 4px",
              gap: "16px",
              "@media (max-width: 800px)": {
                flexDirection: "column",
                alignItems: "flex-start",
              },
            }}
          >
            {/* Foto e Nome */}
            <Box
              sx={{
                flex: "2",
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <ImgFromDB
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "100%",
                }}
                alt="employee image"
                src={
                  employee.profileImgUrl ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                }
              />
              <Stack>
                <TextRob14Font1Xs
                  sx={{
                    color: theme[mode].black,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {employee.fullName || employee.username}
                </TextRob14Font1Xs>
                <TextRob12Font2Xs
                  sx={{
                    color: theme[mode].gray,
                    fontSize: "12px",
                    fontWeight: 400,
                  }}
                >
                  {employee.email || ""}
                </TextRob12Font2Xs>
              </Stack>
            </Box>

            {/* Última atividade */}
            <Box
              sx={{
                flex: "2.0",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                "@media (max-width: 900px)": { display: "none" },
              }}
            >
              <TextRob12Font2Xs
                sx={{
                  color: theme[mode].gray,
                  fontSize: "12px",
                  fontWeight: 400,
                }}
              >
                {t("colaboratorRegister.lastActivity")}
              </TextRob12Font2Xs>
              <TextRob14Font1Xs
                sx={{
                  color: theme[mode].black,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {employee.lastLoginDate
                  ? moment(employee.lastLoginDate).format("DD/MM/YYYY HH:mm")
                  : t("colaboratorRegister.noActivity")}
              </TextRob14Font1Xs>
            </Box>

            {/* Empresa, Cargo e Status */}
            <Box
              sx={{
                flex: "2",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <TextRob14Font1Xs
                sx={{
                  boxSizing: "content-box",
                  padding: "0 10px",
                  fontWeight: "400",
                  borderRadius: "12px",
                  border: `1px solid ${theme[mode].blueDark}`,
                  color: theme[mode].blueDark,
                  maxWidth: "120px",
                  overflow: "hidden",
                  textWrap: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {employee.brandMaster?.brandName || "-"}
              </TextRob14Font1Xs>

              {employee.field && (
                <TextRob14Font1Xs
                  sx={{
                    boxSizing: "content-box",
                    padding: "0 10px",
                    fontWeight: "400",
                    borderRadius: "12px",
                    border: `1px solid ${theme[mode].blueDark}`,
                    color: theme[mode].blueDark,
                    maxWidth: "120px",
                    overflow: "hidden",
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {employee.field}
                </TextRob14Font1Xs>
              )}

              <TextRob14Font1Xs
                sx={{
                  boxSizing: "content-box",
                  padding: "0 10px",
                  fontWeight: "400",
                  borderRadius: "12px",
                  border: `1px solid ${
                    employee.isActive ? theme[mode].ok : theme[mode].danger
                  }`,
                  color: employee.isActive
                    ? theme[mode].ok
                    : theme[mode].danger,
                }}
              >
                {t(
                  `colaboratorRegister.${employee.isActive ? "active" : "inactive"}`,
                )}
              </TextRob14Font1Xs>
            </Box>

            {/* Ações */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
                justifyContent: "flex-start",
                "@media (max-width: 600px)": { display: "none" },
              }}
            >
              {(role === "admin" || role === "manager") && (
                <IconButton onClick={() => handleEdit(employee.idUser)}>
                  <PencilCicleIcon fill={theme[mode].blueMedium} />
                </IconButton>
              )}
              {role === "admin" && (
                <IconButton onClick={() => handleDelete(employee.idUser)}>
                  <DeleteForeverIcon sx={{ color: theme[mode].danger }} />
                </IconButton>
              )}
            </Box>
          </Box>

          {index !== filteredEmployees.length - 1 && (
            <div
              style={{
                height: "1px",
                minHeight: "1px",
                maxHeight: "1px",
                width: "100%",
                background: theme[mode].grayLight,
              }}
            />
          )}
        </Fragment>
      ))}
    </Stack>
  );
};
