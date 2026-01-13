import { Box } from "@mui/material";
import { FilterInput } from "../../../components/Inputs/FilterInput";
import { FilterIcon } from "../../../icons/FilterIcon";
import { useZTheme } from "../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZColaboratorRegisterPage } from "../../../stores/useZColaboratorRegisterPage";

export const ColaboratorTableFilters = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { userFilter, setUserFilter, companyFilterText, setCompanyFilterText } =
    useZColaboratorRegisterPage();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        "@media (max-width: 600px)": {
          width: "100%",
        },
      }}
    >
      <FilterInput
        icon={<FilterIcon fill={theme[mode].gray} />}
        value={companyFilterText}
        onChange={setCompanyFilterText}
        placeholder={t("colaboratorRegister.companyFilterPlaceholder")}
        sxContainer={{
          "@media (max-width: 600px)": {
            width: "100%",
          },
        }}
      />
      <FilterInput
        icon={<FilterIcon fill={theme[mode].gray} />}
        value={userFilter}
        onChange={setUserFilter}
        placeholder={t("colaboratorRegister.UserFilterPlaceholder")}
        sxContainer={{
          "@media (max-width: 600px)": {
            width: "100%",
          },
        }}
      />
    </Box>
  );
};
