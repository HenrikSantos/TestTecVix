import { useTranslation } from "react-i18next";
import { useZTheme } from "../../../stores/useZTheme";
import { Stack } from "@mui/material";
import { SearchInput } from "../../../components/Inputs/SearchInput";
import { DropDown } from "../../../components/Inputs/DropDown";
import { FilterIcon } from "../../../icons/FilterIcon";
import { useZMyVMsList } from "../../../stores/useZMyVMsList";
import { useEffect } from "react";
import { CheckboxLabel } from "../../VirtualMachine/components/CheckboxLabel";
import { formatToIOptionMPS } from "../../../utils/formatOptions";
import { api } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import { IListAll } from "../../../types/ListAllTypes";
import { TrashIcon } from "../../../icons/TrashIcon";

export const Header = () => {
  const { t } = useTranslation();
  const { theme, mode } = useZTheme();
  const {
    search,
    setSearch,
    setStatus,
    setOnlyMyVMs,
    setMsps,
    msps,
    onlyMyVMs,
    setSelectedMSP,
    selectedMSP,
  } = useZMyVMsList();

  const { getAuth } = useAuth();

  const fetchMSPs = async () => {
    const auth = await getAuth();
    const response = await api.get<
      IListAll<{
        idBrandMaster: number;
        brandName: string;
        deletedAt: Date | string | null;
      }>
    >({
      url: `/brand-master`,
      auth,
      params: {
        orderBy: "deletedAt:asc,brandName:asc",
      },
    });
    if (response.error) {
      return {
        result: [],
        totalCount: 0,
      };
    }

    return response.data;
  };

  useEffect(() => {
    fetchMSPs().then((response) => {
      setMsps(
        response.result.map((m) => ({
          idBrandMaster: m.idBrandMaster,
          brandName: m.brandName,
          deletedAt: m.deletedAt,
        })),
      );
    });
  }, []);

  const handleSearch = (value: string) => {
    if (value === search) return;
    setSearch(value.trim());
  };

  const getStatusTag = (status: string) => {
    let background = "";
    switch (status) {
      case "null":
        background = theme[mode].blueLight;
        break;

      case "RUNNING":
        background = theme[mode].greenLight;
        break;

      case "PAUSED":
        background = theme[mode].tertiary;
        break;

      default:
        background = theme[mode].lightRed;
        break;
    }
    return (
      <Stack
        sx={{
          background,
          borderRadius: "50%",
          marginRight: "12px",
          width: "8px",
          height: "8px",
        }}
      />
    );
  };

  return (
    <Stack
      sx={{
        flexDirection: "row",
        width: "100%",
        mt: "6px",
        gap: "16px",
        "@media (max-width: 1050px)": {
          flexDirection: "column",
        },
        "@media (max-width: 659px)": {
          flexDirection: "column",
          alignItems: "center",
        },
      }}
    >
      <SearchInput
        goSearch={handleSearch}
        sxContainer={{
          "@media (max-width: 659px)": {
            maxWidth: "100%",
          },
        }}
      />
      <Stack
        sx={{
          flexDirection: "row",
          gap: "16px",
          "@media (max-width: 659px)": {
            flexDirection: "column",
            marginLeft: 0,
            alignItems: "center",
            width: "100%",
          },
        }}
      >
        <DropDown
          data={[
            {
              label: t("myVMs.actives"),
              value: "RUNNING",
              tag: getStatusTag("RUNNING"),
            },
            {
              label: t("myVMs.inactives"),
              value: "STOPPED",
              tag: getStatusTag("STOPPED"),
            },
            {
              label: t("myVMs.waiting"),
              value: "null",
              tag: getStatusTag("null"),
            },
            {
              label: t("myVMs.paused"),
              value: "PAUSED",
              tag: getStatusTag("PAUSED"),
            },
          ]}
          onChange={(val) => {
            setStatus((val?.value as string) || undefined);
          }}
          sxContainer={{
            width: "216px",
            "@media (max-width: 659px)": {
              width: "100%",
            },
          }}
          placeholder={t("myVMs.allVMs")}
          placeholderIcon={<FilterIcon fill={theme[mode].gray} />}
        />
        <DropDown
          data={formatToIOptionMPS(msps).map((msp) => ({
            ...msp,
            tag: msp.deletedAt ? (
              <TrashIcon
                width={"12px"}
                fill={theme[mode].danger}
                className="mr-2 opacity-50"
              />
            ) : null,
          }))}
          onChange={(val) => {
            if (onlyMyVMs) setOnlyMyVMs(false);
            if (val) {
              setSelectedMSP({
                idBrandMaster: val?.id,
                brandName: val?.label,
              });
              return;
            }
            setSelectedMSP(null);
          }}
          value={
            selectedMSP
              ? {
                  id: selectedMSP.idBrandMaster,
                  label: selectedMSP.brandName,
                  value: selectedMSP,
                }
              : null
          }
          sxContainer={{
            width: "216px",
            "@media (max-width: 659px)": {
              width: "100%",
            },
          }}
          placeholder={t("invoices.msps")}
          placeholderIcon={<FilterIcon fill={theme[mode].gray} />}
          sxItemList={{ textTransform: "none" }}
        />
        {
          <Stack sx={{ justifyContent: "center" }}>
            <CheckboxLabel
              label={
                selectedMSP === null
                  ? t("myVMs.onlyMyVms")
                  : t("myVMs.onlyMSPVms")
              }
              value={onlyMyVMs}
              onChange={() => {
                setOnlyMyVMs(!onlyMyVMs);
              }}
            />
          </Stack>
        }
      </Stack>
    </Stack>
  );
};
