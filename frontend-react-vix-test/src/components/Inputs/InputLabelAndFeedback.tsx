import {
  FormControl,
  IconButton,
  InputAdornment,
  SxProps,
  TextField,
} from "@mui/material";
import { TextRob16FontL } from "../TextL";
import { useZTheme } from "../../stores/useZTheme";
import { useState } from "react";
import { VisibilityOn, VisibilityOff } from "../../icons/Visibility";

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
  sideLabel?: React.ReactNode;
  sxSidelabel?: React.CSSProperties;
  sxLabel?: SxProps;
  sxContainer?: SxProps;
  errorMessage?: React.ReactNode | string;
  inputName?: string | undefined;
  autoComplete?: string;
  onClickIcon?: () => void;
}

export const InputLabelAndFeedback = ({
  value,
  onChange,
  label,
  placeholder,
  sx = {},
  sxLabel = {},
  className = "",
  type = "text",
  disabled = false,
  icon,
  sxContainer,
  errorMessage,
  sideLabel,
  sxSidelabel,
  inputName,
  autoComplete = "",
  onClickIcon,
  onBlur = () => {},
}: Props) => {
  const { theme, mode } = useZTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      <TextField
        onBlur={onBlur}
        disabled={disabled}
        name={inputName}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={showPassword ? "text" : type}
        InputProps={{
          endAdornment: (
            <>
              {type === "password" && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle-password-visibility"
                    onClick={handleTogglePasswordVisibility}
                    sx={{
                      color: theme[mode].primary,
                      marginRight: "-8px", // Slight adjustment for spacing
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOff fill={theme[mode].tertiary} />
                    ) : (
                      <VisibilityOn fill={theme[mode].tertiary} />
                    )}
                  </IconButton>
                </InputAdornment>
              )}
              {icon && type !== "password" && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="icon-edit-indicator"
                    onClick={onClickIcon ? onClickIcon : () => onChange("")}
                    sx={{
                      color: theme[mode].primary,
                      marginRight: "-8px",
                    }}
                  >
                    {icon}
                  </IconButton>
                </InputAdornment>
              )}
            </>
          ),
        }}
        sx={{
          width: "100%",
          backgroundColor: theme[mode].grayLight,
          borderRadius: "12px",
          border: errorMessage ? "1px solid " + theme[mode].danger : "none",
          "& .MuiOutlinedInput-root": {
            height: "40px",
            paddingRight: "14px", // Ensure space for adornment
            "& fieldset": {
              border: errorMessage ? `1px solid ${theme[mode].danger}` : "none",
              borderRadius: "12px",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: `1px solid ${errorMessage ? theme[mode].danger : theme[mode].blue}`,
              borderRadius: "12px",
            },
          },
          ".MuiInputBase-input": {
            padding: "4px 8px",
            paddingLeft: "16px",
            // height: "36px", // Removed explicit input height
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
    </FormControl>
  );
};
