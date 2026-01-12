import { useTranslation } from "react-i18next";
import { themeColors, useZTheme } from "../../../../stores/useZTheme";
import { TextRob16FontL } from "../../../../components/TextL";
import { SimpleInput } from "../../../../components/Inputs/SimpleInput";
import { Button } from "@mui/material";
import { TextRob14Font1Xs } from "../../../../components/Text1Xs";
import { useZBrandInfo } from "../../../../stores/useZBrandStore";
import { useBrandMasterResources } from "../../../../hooks/useBrandMasterResources";
import { AbsoluteBackDrop } from "../../../../components/AbsoluteBackDrop";

interface IWhiteLabelChildProps {
  theme: {
    dark: themeColors;
    light: themeColors;
  };
}

export const LeftCardDomain = ({ theme }: IWhiteLabelChildProps) => {
  const { mode } = useZTheme();
  const { t } = useTranslation();
  const {
    brandLogoTemp,
    brandObjectName,
    setBrandInfo,
    domain: domainName,
  } = useZBrandInfo();
  // const [domain, setDomain] = useState<string>(domainName);
  // const { updateDomain } = useBrandMasterResources();
  const { updateBrandMaster, isLoading } = useBrandMasterResources();

  // const handleSave = async () => {
  //   const response = await updateBrandMaster({
  //     domain,
  //     brandLogo: brandObjectName || undefined,
  //   });
  //   if (!response) return;
  //   if (domain !== domainName) {
  //     const r = await updateDomain(domain);
  //     if (!r) return;
  //   }
  //   setBrandInfo({
  //     ...(brandLogoTemp
  //       ? { brandLogo: brandLogoTemp, brandLogoTemp: "", brandObjectName: "" }
  //       : {}),
  //     domain,
  //   });
  // };

  const handleSave = async () => {
    const response = await updateBrandMaster({
      brandLogo: brandObjectName || undefined,
    });
    if (!response) return;
    setBrandInfo({
      ...(brandLogoTemp
        ? { brandLogo: brandLogoTemp, brandLogoTemp: "", brandObjectName: "" }
        : {}),
    });
  };

  return (
    <>
      <AbsoluteBackDrop open={isLoading} />
      <TextRob16FontL
        sx={{
          fontWeight: 500,
          fontSize: "16px",
          color: theme[mode].primary,
          marginBottom: "16px",
        }}
      >
        {t("whiteLabel.dns")}
      </TextRob16FontL>
      <SimpleInput
        placeholder="Domain/Subdomain"
        onChange={() => {}}
        value={domainName}
        disabled
        sx={{
          marginBottom: "24px",
          "& .Mui-disabled": {
            color: theme[mode].gray,
            pointerEvents: "inherit",
            cursor: "not-allowed",
            WebkitTextFillColor: "unset",
          },
        }}
        inputSx={{
          width: "100%",
          height: "48px",
          boxSizing: "border-box",
          padding: "16px",
          borderRadius: "12px",
          background: theme[mode].grayLight,
          color: theme[mode].gray,
        }}
      />
      <Button
        sx={{
          background: theme[mode].blue,
          width: "100%",
          color: theme[mode].btnText,
          fontWeight: 500,
          fontSize: "16px",
          textTransform: "none",
          height: "48px",
          borderRadius: "12px",
        }}
        onClick={() => handleSave()}
      >
        {t("whiteLabel.saveChanges")}
      </Button>
      <TextRob14Font1Xs
        sx={{
          color: mode === "light" ? theme.light.ok : theme.dark.greenLight,
          fontWeight: 400,
          fontSize: "14px",
          height: "20px",
          marginTop: "16px",
        }}
      ></TextRob14Font1Xs>
    </>
  );
};
