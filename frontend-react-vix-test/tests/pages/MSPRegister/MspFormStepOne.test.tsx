import React from "react";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MspFormStepOne } from "../../../src/pages/MSPRegister/MspFormModal/MspFormStepOne";
import "@testing-library/jest-dom/vitest";

const mockOnContinue = vi.fn();
const mockOnCancel = vi.fn();

const mockSetCompanyName = vi.fn();
const mockSetLocality = vi.fn();
const mockSetCnpj = vi.fn();
const mockSetPhone = vi.fn();
const mockSetSector = vi.fn();
const mockSetContactEmail = vi.fn();
const mockSetMinConsumption = vi.fn();
const mockSetDiscountRate = vi.fn();
const mockSetIsPoc = vi.fn();
const mockSetShowError = vi.fn();

const defaultMockState = {
  companyName: "",
  locality: "",
  cnpj: "",
  phone: "",
  sector: "",
  contactEmail: "",
  minConsumption: 0,
  discountRate: 0,
  isPoc: false,
  showError: false,
  setCompanyName: mockSetCompanyName,
  setLocality: mockSetLocality,
  setCnpj: mockSetCnpj,
  setPhone: mockSetPhone,
  setSector: mockSetSector,
  setContactEmail: mockSetContactEmail,
  setMinConsumption: mockSetMinConsumption,
  setDiscountRate: mockSetDiscountRate,
  setIsPoc: mockSetIsPoc,
  setShowError: mockSetShowError,
};

let mockStoreState = { ...defaultMockState };

vi.mock("../../../src/stores/useZMspRegisterPage", () => ({
  useZMspRegisterPage: () => mockStoreState,
}));

vi.mock("../../../src/stores/useZTheme", () => ({
  useZTheme: () => ({
    mode: "light",
    theme: {
      light: {
        blue: "#0000FF",
        blueDark: "#0000CC",
        primary: "#000000",
        mainBackground: "#FFFFFF",
        gray: "#808080",
        grayLight: "#F0F0F0",
        btnText: "#FFFFFF",
        black: "#000000",
        danger: "#FF0000",
        tertiary: "#666666",
      },
    },
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

interface InputLabelProps {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: React.ReactNode;
  placeholder?: string;
}

interface DropDrownLabelProps {
  label: React.ReactNode;
  data: { label: string; value: unknown }[];
  value: { label: string; value: unknown } | null;
  onChange: (value: { label: string; value: unknown } | null) => void;
  errorMessage?: React.ReactNode;
}

interface CheckboxLabelProps {
  label: string;
  checked: boolean;
  handleChange: () => void;
}

vi.mock("../../../src/components/Inputs/InputLabelAndFeedback", () => ({
  InputLabelAndFeedback: ({
    label,
    value,
    onChange,
    errorMessage,
    placeholder,
  }: InputLabelProps) => (
    <div data-testid={`input-${placeholder || "default"}`}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={`input-field-${placeholder || "default"}`}
      />
      {errorMessage && <span data-testid="error-message">{errorMessage}</span>}
    </div>
  ),
}));

vi.mock("../../../src/components/Inputs/DropDrownLabel", () => ({
  DropDrownLabel: ({
    label,
    data,
    value,
    onChange,
    errorMessage,
  }: DropDrownLabelProps) => (
    <div data-testid={`dropdown-${String(label).substring(0, 20)}`}>
      <label>{label}</label>
      <select
        value={(value?.value as string) || ""}
        onChange={(e) => {
          const selected = data.find((d) => d.value === e.target.value);
          onChange(selected || null);
        }}
        data-testid={`dropdown-field-${String(label).substring(0, 20)}`}
      >
        <option value="">Select</option>
        {data.map((item) => (
          <option key={String(item.value)} value={String(item.value)}>
            {item.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <span data-testid="dropdown-error-message">{errorMessage}</span>
      )}
    </div>
  ),
}));

vi.mock("../../../src/components/Inputs/InputLabelTooltip", () => ({
  InputLabelTooltip: ({
    label,
    value,
    onChange,
    placeholder,
  }: InputLabelProps) => (
    <div data-testid={`tooltip-input-${placeholder || "default"}`}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={`tooltip-field-${placeholder || "default"}`}
      />
    </div>
  ),
}));

vi.mock("../../../src/components/CheckboxLabel", () => ({
  CheckboxLabel: ({ label, checked, handleChange }: CheckboxLabelProps) => (
    <div data-testid="checkbox-poc">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        data-testid="checkbox-field-poc"
      />
      <label>{label}</label>
    </div>
  ),
}));

vi.mock("../../../src/components/Buttons/Btn", () => ({
  Btn: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button onClick={onClick} data-testid={`btn-${children}`}>
      {children}
    </button>
  ),
}));

vi.mock("../../../src/components/Text1S", () => ({
  TextRob16Font1S: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("../../../src/utils/maskCNPJ", () => ({
  maskCNPJ: (v: string) => v,
}));

vi.mock("../../../src/utils/maskPhone", () => ({
  maskPhone: (v: string) => v,
}));

vi.mock("../../../src/utils/isValidCNPJ", () => ({
  isValidCNPJ: (cnpj: string) => cnpj.length === 18,
}));

vi.mock("../../../src/icons/PencilIcon", () => ({
  PencilIcon: () => <span>PencilIcon</span>,
}));

describe("MspFormStepOne", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreState = { ...defaultMockState };
  });

  it("should render the form title", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );
    expect(screen.getByText("mspRegister.companyInfos")).toBeInTheDocument();
  });

  it("should render all required fields", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    expect(screen.getByTestId("input-Vituax")).toBeInTheDocument();
    expect(screen.getByTestId("input-00.000.000/0001-00")).toBeInTheDocument();
    expect(screen.getByTestId("input-vituax@gmail.com")).toBeInTheDocument();
  });

  it("should render continue and cancel buttons", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    expect(screen.getByTestId("btn-mspRegister.continue")).toBeInTheDocument();
    expect(screen.getByTestId("btn-mspRegister.cancel")).toBeInTheDocument();
  });

  it("should call onCancel when cancel button is clicked", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    const cancelButton = screen.getByTestId("btn-mspRegister.cancel");
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("should show error and not continue when required fields are empty", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    const continueButton = screen.getByTestId("btn-mspRegister.continue");
    fireEvent.click(continueButton);

    expect(mockSetShowError).toHaveBeenCalledWith(true);
    expect(mockOnContinue).not.toHaveBeenCalled();
  });

  it("should call setCompanyName when company name input changes", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    const companyInput = screen.getByTestId("input-field-Vituax");
    fireEvent.change(companyInput, { target: { value: "Test Company" } });

    expect(mockSetCompanyName).toHaveBeenCalledWith("Test Company");
  });

  it("should call setCnpj when CNPJ input changes", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    const cnpjInput = screen.getByTestId("input-field-00.000.000/0001-00");
    fireEvent.change(cnpjInput, { target: { value: "12345678901234" } });

    expect(mockSetCnpj).toHaveBeenCalled();
  });

  it("should call setContactEmail when email input changes", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    const emailInput = screen.getByTestId("input-field-vituax@gmail.com");
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });

    expect(mockSetContactEmail).toHaveBeenCalledWith("test@test.com");
  });

  it("should render POC checkbox", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    expect(screen.getByTestId("checkbox-poc")).toBeInTheDocument();
  });

  it("should toggle POC checkbox when clicked", () => {
    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    const checkbox = screen.getByTestId("checkbox-field-poc");
    fireEvent.click(checkbox);

    expect(mockSetIsPoc).toHaveBeenCalled();
  });

  it("should continue when all required fields are valid", () => {
    mockStoreState = {
      ...defaultMockState,
      companyName: "Test Company",
      locality: "Brasil",
      cnpj: "12.345.678/0001-90",
      sector: "Telecom",
      contactEmail: "test@test.com",
    };

    render(
      <MspFormStepOne onContinue={mockOnContinue} onCancel={mockOnCancel} />,
    );

    const continueButton = screen.getByTestId("btn-mspRegister.continue");
    fireEvent.click(continueButton);

    expect(mockSetShowError).toHaveBeenCalledWith(false);
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });
});
