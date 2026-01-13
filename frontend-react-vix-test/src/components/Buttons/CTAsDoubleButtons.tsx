import { Button, Stack, SxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { useZTheme } from "../../stores/useZTheme";

interface IProps {
  handleSave: () => void;
  handleRestore: () => void;
  saveDisabled?: boolean;
  restoreDisabled?: boolean;
  labelSave?: ReactNode;
  labelRestore?: ReactNode;
  sx?: SxProps<Theme>;
  sxButtonSave?: SxProps<Theme>;
  sxButtonRestore?: SxProps<Theme>;
}

export const CTAsDoubleButtons = ({
  handleSave,
  handleRestore,
  saveDisabled = false,
  restoreDisabled = false,
  labelSave,
  labelRestore,
  sx,
  sxButtonSave,
  sxButtonRestore,
}: IProps) => {
  const { theme, mode } = useZTheme();

  return (
    <Stack
      flexDirection={"row"}
      sx={{
        gap: "24px",
        "@media (max-width: 745px)": {
          flexDirection: "column",
        },
        ...sx,
      }}
    >
      <Button
        sx={{
          background: theme[mode].blue,
          border: `1px solid ${theme[mode].blue}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "&:disabled": {
            cursor: "not-allowed",
            color: theme["light"].btnWhite,
            opacity: 0.7,
          },
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
          ...sxButtonSave,
        }}
        onClick={handleSave}
        disabled={saveDisabled}
      >
        {labelSave}
      </Button>
      <Button
        sx={{
          background: "transparent",
          border: `1px solid ${theme[mode].blueDark}`,
          textTransform: "none",
          borderRadius: "12px",
          height: "48px",
          fontWeight: "500",
          fontSize: "16px",
          width: "100%",
          maxWidth: "330px",
          "&:disabled": { cursor: "not-allowed" },
          "@media (max-width: 745px)": {
            maxWidth: "100%",
          },
          ...sxButtonRestore,
        }}
        onClick={handleRestore}
        disabled={restoreDisabled}
      >
        {labelRestore}
      </Button>
    </Stack>
  );
};
