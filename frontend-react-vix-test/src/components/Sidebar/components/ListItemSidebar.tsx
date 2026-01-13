import { Divider, List, Stack } from "@mui/material";
import type { SVGProps } from "react";
import { useZTheme } from "../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { useSetSidebar } from "../../../hooks/useSetSidebar";
import { useLogin } from "../../../hooks/useLogin";
import { LogoBrand } from "../../LogoBrand";
import { Item } from "./Item";
import { HomeIcon } from "../../../icons/HomeIcon";
import { PlusIcon } from "../../../icons/PlusIcon";
import { NetworkIcon } from "../../../icons/NetworkIcon";
import { SettingsIcon } from "../../../icons/SettingsIcon";
import { ExitIcon } from "../../../icons/ExitIcon";
import { Link, useLocation } from "react-router-dom";
import { ItemListed } from "./ItemListed";
import { useZBrandInfo } from "../../../stores/useZBrandStore";
import { UserCheckDone } from "../../../icons/UserCheckDone";
import { CloudIcon } from "../../../icons/CloudIcon";
import { useZUserProfile } from "../../../stores/useZUserProfile";

export const ListItemSidebar = () => {
  const { mode, theme } = useZTheme();
  const shadow =
    mode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(217, 217, 217, 0.4)";

  const { t } = useTranslation();
  const { handleSelect, selected } = useSetSidebar(); // adicionar a nova rota /new-route no hashmap desse hook
  const { goLogout } = useLogin();
  const { pathname } = useLocation();
  const { manual, termsOfUse, privacyPolicy } = useZBrandInfo();
  const { idBrand } = useZUserProfile();
  const lan = t("costsAndFinances.lan") === "pt" ? "pt" : "eng";
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3001";
  const manualUrl = `${baseUrl}/uploads/dark-user-manual-vituax-${lan}.pdf`;

  type RegisterListItem = {
    text: string;
    path: string;
    isSelected: boolean;
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    isInternalOnly: boolean;
  };

  const registersList: RegisterListItem[] = [
    {
      text: t("sidebar.mspRegister"),
      path: "/msp-register",
      isSelected: pathname === "/msp-register",
      icon: (props) => <UserCheckDone {...props} />,
      isInternalOnly: true,
    },
    {
      text: t("sidebar.colaboratorRegister"),
      path: "/colaborator-register",
      isSelected: pathname === "/colaborator-register",
      icon: (props) => <UserCheckDone {...props} />,
      isInternalOnly: false,
    },
  ];

  const filteredRegistersList = registersList.filter((item) => {
    if (item.isInternalOnly && idBrand !== null) return false;
    return true;
  });

  return (
    <Stack
      className="flex-1"
      sx={{
        width: "100%",
        maxWidth: "300px",
        minWidth: "250px",
        background: theme[mode].mainBackground,
        boxShadow: `1px 0px 8px 0 ${shadow}`,
        overflowY: "auto",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          height: "88px",
        }}
      >
        <LogoBrand />
      </Stack>
      <Divider />
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Item
          icon={(props) => <HomeIcon {...props} />}
          text={t("sidebar.home")}
          handleSelect={(val) => handleSelect(val, "/")}
          selected={selected}
        />
        <Item
          icon={(props) => <PlusIcon {...props} />}
          text={t("sidebar.newVM")}
          handleSelect={(val) => handleSelect(val, "/virtual-machine")}
          selected={selected}
        />
        <Item
          icon={(props) => <CloudIcon {...props} />}
          text={t("sidebar.myVMs")}
          handleSelect={(val) => handleSelect(val, "/my-virtual-machines")}
          selected={selected}
        />
        <ItemListed
          icon={(props) => <NetworkIcon {...props} />}
          text={t("sidebar.registers")}
          handleSelect={handleSelect}
          selected={selected}
          listItems={filteredRegistersList}
          hadleSelectItem={(val) =>
            handleSelect(t("sidebar.registers"), val.path)
          }
        />
      </List>
      <Stack
        sx={{
          mt: "auto",
          pb: "10px",
        }}
      >
        <List>
          <Item
            icon={(props) => (
              <SettingsIcon {...props} fill={theme[mode].blueMedium} />
            )}
            text={t("sidebar.settings")}
            handleSelect={(val) => handleSelect(val, "/settings")}
            selected={selected}
          />
          <Item
            icon={(props) => (
              <ExitIcon {...props} fill={theme[mode].blueMedium} />
            )}
            text={t("sidebar.exit")}
            handleSelect={() => goLogout()}
            selected={selected}
          />
        </List>

        <Stack
          style={{
            color: theme[mode].tertiary,
            fontSize: "12px",
            fontFamily: "Roboto",
            fontWeight: "400",
            lineHeight: "16px",
            wordWrap: "break-word",
            flexDirection: "column",
            padding: "0px 24px",
            gap: "12px",
          }}
        >
          <Link to={manual || manualUrl} target="_blank">
            {t("sidebar.manual")}
          </Link>
          <Link to={termsOfUse || "/"} target="_blank">
            {t("sidebar.termsOfUse")}
          </Link>
          <Link to={privacyPolicy || "/"} target="_blank">
            {t("sidebar.privacyAndPolicy")}
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};
