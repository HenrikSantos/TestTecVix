import { Stack } from "@mui/material";
import { TextRob18Font2M } from "../../../../components/Text2M";
import { useZTheme } from "../../../../stores/useZTheme";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useZBrandInfo } from "../../../../stores/useZBrandStore";

export const NewOnVituaX = () => {
  const { mode, theme } = useZTheme();
  const { t } = useTranslation();
  const { brandName } = useZBrandInfo();

  return (
    <Stack
      py={"12px"}
      sx={{
        width: "100%",
        marginTop: "24px",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <TextRob18Font2M
        sx={{
          display: "flex",
          gap: "4px",
          color: theme[mode].dark,
        }}
      >
        {t("loginRegister.newOnVituax", { brandName })}
        <Link to={"/register"}>
          <span
            style={{
              fontFamily: "Roboto",
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: "20px",
              color: theme[mode].blue,
            }}
          >
            {t("loginRegister.newAccount")}
          </span>
        </Link>
      </TextRob18Font2M>
    </Stack>
  );
};
