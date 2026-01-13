import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonalInformation } from "../../../../src/pages/Settings/components/ProfileAndNotifications/components/PersonalInformation";

const mockSetFormProfileNotifications = vi.fn();
const mockMaskPhone = vi.fn((value: string) => `masked-${value}`);

const defaultFormState = {
  userEmail: { value: "", errorMessage: "" },
  userName: { value: "", errorMessage: "" },
  userPhone: { value: "", errorMessage: "" },
  password: { value: "", errorMessage: "" },
  confirmPassword: { value: "", errorMessage: "" },
  fullNameForm: { value: "", errorMessage: "" },
  setFormProfileNotifications: mockSetFormProfileNotifications,
};

const defaultUserState = {
  username: "storedUser",
  userEmail: "stored@example.com",
  userPhoneNumber: "11911111111",
  fullName: "Stored Name",
};

let mockFormState = { ...defaultFormState };
let mockUserState = { ...defaultUserState };

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../../src/stores/useZTheme", () => ({
  useZTheme: () => ({
    mode: "light",
    theme: {
      light: {
        black: "#000000",
        blueMedium: "#0000FF",
        danger: "#FF0000",
        grayLight: "#F0F0F0",
        primary: "#111111",
        tertiary: "#999999",
      },
    },
  }),
}));

vi.mock("../../../../src/stores/useZUserProfile", () => ({
  useZUserProfile: () => mockUserState,
}));

vi.mock("../../../../src/stores/useZFormProfileNotifications", () => ({
  useZFormProfileNotifications: () => mockFormState,
}));

vi.mock("../../../../src/utils/maskPhone", () => ({
  maskPhone: (value: string) => mockMaskPhone(value),
}));

vi.mock("../../../../src/components/TextL", () => ({
  TextRob16FontL: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("../../../../src/icons/EditCirclePencilIcon", () => ({
  EditCirclePencilIcon: () => <span />,
}));

vi.mock(
  "../../../../src/pages/Settings/components/ProfileAndNotifications/components/PerfilPhotoUpload",
  () => ({
    PerfilPhotoUpload: () => <div data-testid="perfil-photo-upload" />,
  }),
);

vi.mock("../../../../src/components/Inputs/InputLabelAndFeedback", () => ({
  InputLabelAndFeedback: ({
    label,
    placeholder,
    value,
    onChange,
    onBlur,
  }: {
    label: React.ReactNode;
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
    onBlur?: () => void;
  }) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={`input-${String(placeholder || label)}`}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  ),
}));

describe("PersonalInformation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFormState = { ...defaultFormState };
    mockUserState = { ...defaultUserState };
  });

  it("should initialize form with user data", () => {
    render(<PersonalInformation />);

    expect(mockSetFormProfileNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        fullNameForm: expect.objectContaining({ value: "Stored Name" }),
        userName: expect.objectContaining({ value: "storedUser" }),
        userEmail: expect.objectContaining({ value: "stored@example.com" }),
        userPhone: expect.objectContaining({ value: "11911111111" }),
      }),
    );
  });

  it("should apply phone mask when typing", () => {
    render(<PersonalInformation />);

    mockSetFormProfileNotifications.mockClear();

    fireEvent.change(screen.getByTestId("input-(00) 0000-0000"), {
      target: { value: "11999999999" },
    });

    expect(mockMaskPhone).toHaveBeenCalledWith("11999999999");
    expect(mockSetFormProfileNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        userPhone: expect.objectContaining({
          value: "masked-11999999999",
        }),
      }),
    );
  });
});
