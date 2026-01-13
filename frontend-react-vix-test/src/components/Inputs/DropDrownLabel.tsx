import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Popper, Stack, SxProps } from "@mui/material";
import { useZTheme } from "../../stores/useZTheme";
import { TextRob16FontL } from "../TextL";
import { shadow } from "../../utils/shadow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CloseXIcon } from "../../icons/CloseXIcon";

interface Props {
  data: {
    label: string;
    value: unknown;
  }[];
  sx?: SxProps;
  value?: { label: string; value: unknown } | null;
  onChange: (value: { label: string; value: unknown } | null) => void;
  onBlur?: () => void;
  label?: React.ReactNode;
  placeholder?: string;
  sideLabel?: React.ReactNode;
  sxSidelabel?: React.CSSProperties;
  sxLabel?: SxProps;
  sxContainer?: SxProps;
  errorMessage?: React.ReactNode;
  disabled?: boolean;
}

export const DropDrownLabel = ({
  data = [],
  sx = {},
  value = null,
  onChange,
  label,
  placeholder,
  sxLabel,
  sxContainer,
  errorMessage,
  sideLabel,
  sxSidelabel,
  disabled,
  onBlur = () => {},
}: Props) => {
  const { theme, mode } = useZTheme();

  return (
    <Stack
      sx={{
        width: "100%",
        gap: "12px",
        ...sxContainer,
      }}
    >
      <TextRob16FontL
        sx={{
          fontWeight: 400,
          lineHeight: "16px",
          color: theme[mode].primary,
          ...sxLabel,
        }}
      >
        {label}
        {sideLabel ? <span style={{ ...sxSidelabel }}>{sideLabel}</span> : null}
      </TextRob16FontL>
      <Autocomplete
        disabled={disabled}
        disablePortal
        onBlur={onBlur}
        options={data}
        renderInput={(params) => (
          <TextField
            {...params}
            disabled={disabled}
            placeholder={placeholder}
            sx={{
              "& .MuiAutocomplete-input": {
                color: theme[mode].primary,
                fontSize: "14px",
                "&.Mui-disabled": {
                  cursor: "not-allowed",
                },
              },
            }}
          />
        )}
        value={value}
        onChange={(_, value) => onChange(value)}
        popupIcon={<ExpandMoreIcon sx={{ color: theme[mode].primary }} />}
        clearIcon={<CloseXIcon fill={theme[mode].primary} width={"18px"} />}
        slots={{
          popper: (props) => (
            <Popper
              {...props}
              sx={{
                ...props.sx,
                boxShadow: `0px 0px 4px ${shadow(mode)}`,
                borderRadius: "12px",
                overflow: "hidden",
              }}
            />
          ),
        }}
        slotProps={{
          popper: {
            sx: {
              border: "4px solid " + theme[mode].mainBackground,
            },
          },
          paper: {
            sx: {
              border: "4px solid " + theme[mode].mainBackground,
            },
          },
          listbox: {
            sx: {
              backgroundColor: theme[mode].mainBackground,
              color: theme[mode].primary,
              fontSize: "14px",
              gap: "4px",
              "& .MuiAutocomplete-option": {
                padding: "4px 12px",
                "&:hover": {
                  backgroundColor: theme[mode].grayLight,
                },
              },
            },
          },
        }}
        sx={{
          backgroundColor: "transparent",
          borderRadius: "12px",
          "& .MuiOutlinedInput-root": {
            height: "40px",
            backgroundColor: theme[mode].grayLight,
            borderRadius: "12px",
            "& fieldset": {
              borderColor: errorMessage ? theme[mode].danger : "transparent",
            },
            "&:hover fieldset": {
              borderColor: errorMessage ? theme[mode].danger : "transparent",
            },
            "&.Mui-focused": {
              backgroundColor: theme[mode].grayLight,
              "& fieldset": {
                borderColor: errorMessage
                  ? theme[mode].danger
                  : theme[mode].blue,
                borderWidth: "1px",
              },
            },
            "& .Mui-disabled": {
              cursor: "not-allowed",
              WebkitTextFillColor: theme[mode].primary + " !important",
              opacity: 0.5,
              "& fieldset": {
                cursor: "not-allowed",
              },
            },
          },
          ...sx,
        }}
      />
      {errorMessage && (
        <TextRob16FontL
          sx={{
            color: theme[mode].danger,
            fontSize: "12px",
          }}
        >
          {errorMessage}
        </TextRob16FontL>
      )}
    </Stack>
  );
};
