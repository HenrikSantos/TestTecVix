import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NotificationsContact } from "../../../../src/pages/Settings/components/ProfileAndNotifications/components/NotificationsContact";

const mockSetFormProfileNotifications = vi.fn();
const mockMaskPhone = vi.fn((value: string) => `masked-${value}`);

const defaultFormState = {
  companyEmail: { value: "", errorMessage: "" },
  companySMS: { value: "", errorMessage: "" },
  timeZone: { value: "", errorMessage: "" },
  setFormProfileNotifications: mockSetFormProfileNotifications,
};

const defaultBrandState = {
  emailContact: "brand@example.com",
  smsContact: "11999999999",
  timezone: "UTC",
};

let mockFormState = { ...defaultFormState };
let mockBrandState = { ...defaultBrandState };
let mockRole = "admin";

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
      },
    },
  }),
}));

vi.mock("../../../../src/hooks/useGenericResources", () => ({
  useGenericResources: () => ({
    timeZones: [
      { label: "UTC", value: "UTC" },
      { label: "America/Sao_Paulo", value: "America/Sao_Paulo" },
    ],
  }),
}));

vi.mock("../../../../src/stores/useZFormProfileNotifications", () => ({
  useZFormProfileNotifications: () => mockFormState,
}));

vi.mock("../../../../src/stores/useZBrandStore", () => ({
  useZBrandInfo: () => mockBrandState,
}));

vi.mock("../../../../src/stores/useZUserProfile", () => ({
  useZUserProfile: () => ({
    role: mockRole,
  }),
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

vi.mock("../../../../src/components/Inputs/InputLabelAndFeedback", () => ({
  InputLabelAndFeedback: ({
    label,
    placeholder,
    value,
    onChange,
    disabled,
    onBlur,
  }: {
    label: React.ReactNode;
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    onBlur?: () => void;
  }) => (
    <div>
      <label>{label}</label>
      <input
        data-testid={`input-${String(placeholder || label)}`}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
    </div>
  ),
}));

vi.mock("../../../../src/components/Inputs/DropDrownLabel", () => ({
  DropDrownLabel: ({
    label,
    placeholder,
    data,
    value,
    onChange,
    disabled,
  }: {
    label: React.ReactNode;
    placeholder?: string;
    data: { label: string; value: unknown }[];
    value: { label: string; value: unknown } | null;
    onChange: (val: { label: string; value: unknown } | null) => void;
    disabled?: boolean;
  }) => (
    <div>
      <span data-testid="dropdown-placeholder">{placeholder}</span>
      <select
        data-testid={`dropdown-${String(label)}`}
        value={(value?.value as string) || ""}
        disabled={disabled}
        onChange={(e) => {
          const selected = data.find(
            (item) => String(item.value) === e.target.value,
          );
          onChange(selected || null);
        }}
      >
        <option value="">Select</option>
        {data.map((item) => (
          <option key={String(item.value)} value={String(item.value)}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe("NotificationsContact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFormState = { ...defaultFormState };
    mockBrandState = { ...defaultBrandState };
    mockRole = "admin";
  });

  it("should apply phone mask and placeholder for admin", () => {
    render(<NotificationsContact />);

    mockSetFormProfileNotifications.mockClear();

    fireEvent.change(screen.getByTestId("input-(00) 00000-0000"), {
      target: { value: "11999999999" },
    });

    expect(mockMaskPhone).toHaveBeenCalledWith("11999999999");
    expect(mockSetFormProfileNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        companySMS: expect.objectContaining({
          value: "masked-11999999999",
        }),
      }),
    );
    expect(screen.getByTestId("dropdown-placeholder")).toHaveTextContent(
      "profileAndNotifications.timeZone",
    );
  });

  it("should disable fields when user is not admin", () => {
    mockRole = "member";
    render(<NotificationsContact />);

    const smsInput = screen.getByTestId("input-(00) 00000-0000");
    expect(smsInput).toBeDisabled();

    mockSetFormProfileNotifications.mockClear();
    fireEvent.change(smsInput, { target: { value: "11999999999" } });
    expect(mockSetFormProfileNotifications).not.toHaveBeenCalled();
  });
});
