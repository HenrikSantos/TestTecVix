import { Box, Stack } from "@mui/material";
import { FilterInput } from "../../../components/Inputs/FilterInput";
import { FilterIcon } from "../../../icons/FilterIcon";
import { useZTheme } from "../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useZMspRegisterPage } from "../../../stores/useZMspRegisterPage";
import { CheckboxLabel } from "../../../components/CheckboxLabel";
import { Btn } from "../../../components/Buttons/Btn";
import { useZUserProfile } from "../../../stores/useZUserProfile";

interface IMspTableFiltersProps {
  onNewMsp?: () => void;
}

export const MspTableFilters = ({ onNewMsp }: IMspTableFiltersProps) => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const { role } = useZUserProfile();
  const { mspTableFilter, setMspTableFilter, isPocFilter, setIsPocFilter } =
    useZMspRegisterPage();

  const canCreate = role === "admin" || role === "manager";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        gap: "24px",
        alignItems: "center",
      }}
    >
      <FilterInput
        icon={<FilterIcon fill={theme[mode].gray} />}
        value={mspTableFilter}
        onChange={setMspTableFilter}
        placeholder={t("mspRegister.filterPlaceholder")}
      />
      <Stack sx={{ justifyContent: "center" }}>
        <CheckboxLabel
          label={t("mspRegister.showOnlyPoc")}
          checked={isPocFilter}
          handleChange={() => setIsPocFilter(!isPocFilter)}
        />
      </Stack>
      {canCreate && onNewMsp && (
        <Btn
          onClick={onNewMsp}
          sx={{
            backgroundColor: theme[mode].blue,
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: 500,
            fontSize: "14px",
            "&:hover": {
              backgroundColor: theme[mode].blueDark,
            },
          }}
        >
          {t("mspRegister.newMsp") || "Novo MSP"}
        </Btn>
      )}
    </Box>
  );
};
