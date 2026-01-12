import {
  FormControl,
  InputAdornment,
  Stack,
  SxProps,
  TextField,
  Tooltip,
} from "@mui/material";
import { TextRob16FontL } from "../TextL";
import { useZTheme } from "../../stores/useZTheme";
import { TooltipIcon } from "../../icons/TooltipIcon";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  sx?: SxProps;
  containerSx?: SxProps;
  className?: string;
  type?: string;
  disabled?: boolean;
  icon?: JSX.Element;
  label?: React.ReactNode;
  toolTipMessage?: React.ReactNode;
  sideLabel?: React.ReactNode;
  sxSidelabel?: React.CSSProperties;
  sxLabel?: SxProps;
  sxContainer?: SxProps;
  inputName?: string | undefined;
  autoComplete?: string;
  onClickIcon?: () => void;
  endText?: string;
  limit?: number;
}

export const InputLabelTooltip = ({
  value,
  onChange,
  label,
  placeholder,
  sx = {},
  sxLabel = {},
  className = "",
  type = "text",
  disabled = false,
  sxContainer,
  inputName,
  autoComplete = "",
  onBlur = () => {},
  toolTipMessage,
  endText,
  limit,
}: Props) => {
  const { theme, mode } = useZTheme();

  return (
    <FormControl
      className={className}
      sx={{
        alignItems: "flex-start",
        width: "100%",
        gap: "12px",
        position: "relative",
        ...sxContainer,
      }}
    >
      <Stack flexDirection={"row"} gap={"8px"} alignItems={"center"}>
        <TextRob16FontL
          sx={{
            color: theme[mode].black,
            fontSize: "14px",
            fontFamily: "Roboto",
            fontWeight: "400",
            lineHeight: "16px",
            wordWrap: "break-word",
            ...sxLabel,
          }}
        >
          {label}
        </TextRob16FontL>
        {Boolean(toolTipMessage) && (
          <Tooltip title={toolTipMessage}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TooltipIcon fill={theme[mode].btnDarkBlue} />
            </div>
          </Tooltip>
        )}
      </Stack>
      <TextField
        onBlur={onBlur}
        disabled={disabled}
        name={inputName}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        sx={{
          width: "100%",
          backgroundColor: theme[mode].grayLight,
          borderRadius: "12px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
              borderRadius: "12px",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: `1px solid ${theme[mode].blue}`,
              borderRadius: "12px",
            },
          },
          ".MuiInputBase-input": {
            padding: "4px 8px",
            paddingLeft: "16px",
            height: "40px",
            color: theme[mode].primary,
            "&::placeholder": {
              color: theme[mode].tertiary,
              opacity: 1,
            },
          },
          "& .Mui-disabled": {
            cursor: "not-allowed",
            WebkitTextFillColor: theme[mode].primary + " !important",
            opacity: 0.7,
            "& fieldset": {
              cursor: "not-allowed",
            },
          },
          ...sx,
        }}
        id={`outlined-adornment-${label}`}
        placeholder={placeholder}
        aria-describedby={`outlined-${label}-helper-text`}
        slotProps={{
          input: {
            endAdornment: endText ? (
              <InputAdornment position="end">
                <span
                  style={{
                    color: theme[mode].tertiary,
                    fontSize: "14px",
                    marginRight: "8px",
                  }}
                >
                  {endText}
                </span>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
      {Boolean(limit) && (
        <TextRob16FontL
          sx={{
            color:
              value?.length > limit ? theme[mode].danger : theme[mode].gray,
            fontSize: "12px",
            fontFamily: "Roboto",
            fontWeight: "400",
            lineHeight: "14px",
            wordWrap: "break-word",
            ...sxLabel,
          }}
        >
          {value?.length || 0}/{limit}
        </TextRob16FontL>
      )}
    </FormControl>
  );
};
