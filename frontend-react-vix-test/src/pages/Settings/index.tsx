import { themeColors, useZTheme } from "../../stores/useZTheme";
import { SettingsTabList } from "./components/List/SettingsTabList";
import { ScreenFullPage } from "../../components/ScreenFullPage";
import { TextRob20Font1MB } from "../../components/Text1MB";
import { useTranslation } from "react-i18next";
import { WhiteLabel } from "./components/WhiteLabel";
import { Stack } from "@mui/material";
import { useZSettingsVar } from "../../stores/useZSettingsVar";
import { TabPanel } from "../../components/Tab/TabPanel";
import { ProfileAndNotifications } from "./components/ProfileAndNotifications";
import { UnderConstruction } from "../../components/UnderConstruction";
import { useEffect, useMemo } from "react";
import { useZUserProfile } from "../../stores/useZUserProfile";

export interface IWhiteLabelChildProps {
  theme: {
    dark: themeColors;
    light: themeColors;
  };
}

export const SettingsPage = () => {
  const { mode, theme } = useZTheme();
  const { currentTabIndex, setSettings } = useZSettingsVar();
  const { t } = useTranslation();
  const user = useZUserProfile();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get("stripe_connected") === "success") {
        setSettings({ currentTabIndex: 2 });
      }
    }
  }, [setSettings]);

  const tabList = useMemo(() => {
    const list = [];

    const canSeeWhiteLabel = !!user.idBrand && user.role === "admin";

    if (canSeeWhiteLabel) {
      list.push({
        label: t("tabs.whiteLabel"),
        component: <WhiteLabel />,
        title: t("whiteLabel.title"),
      });
    }

    list.push(
      {
        label: t("tabs.profileNotifications"),
        component: <ProfileAndNotifications />,
        title: t("tabs.profileNotifications"),
      },
      {
        label: t("tabs.billingsPlans"),
        component: <UnderConstruction />,
        title: t("tabs.billingsPlans"),
      },
      {
        label: t("tabs.logsHistory"),
        component: <UnderConstruction />,
        title: t("tabs.logsHistory"),
      },
    );

    return list;
  }, [user.idBrand, user.role, t]);

  return (
    <ScreenFullPage
      keepSubtitle
      title={
        <TextRob20Font1MB
          sx={{
            color: theme[mode].primary,
            fontSize: "20px",
            fontWeight: "500",
            lineHeight: "24px",
          }}
        >
          {tabList[currentTabIndex].title}
        </TextRob20Font1MB>
      }
      subtitle={<SettingsTabList tabList={tabList} />}
      sxTitleSubTitle={{
        paddingLeft: "40px",
        paddingRight: "40px",
      }}
      sxContainer={{
        paddingLeft: "40px",
        paddingRight: "40px",
        paddingBottom: "40px",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          "@media (max-width: 1000px)": {
            marginTop: "56px",
          },
        }}
      >
        {/* Tab panels */}
        {tabList.map((item, index) => (
          <TabPanel
            value={currentTabIndex}
            index={index}
            key={`${index}-${item.label}`}
          >
            {item.component}
          </TabPanel>
        ))}
      </Stack>
    </ScreenFullPage>
  );
};
