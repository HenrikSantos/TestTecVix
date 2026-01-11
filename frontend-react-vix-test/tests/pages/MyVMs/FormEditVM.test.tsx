import React from "react";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormEditVM } from "../../../src/pages/MyVMs/components/FormEditVM";
import "@testing-library/jest-dom/vitest";

const mockOnClose = vi.fn();
const mockUpdateVM = vi.fn();
const mockUpdateVMStatus = vi.fn().mockResolvedValue(true);
const mockDeleteVM = vi.fn().mockResolvedValue(true);
const mockSetCurrentVM = vi.fn();

const mockCurrentVM = {
  idVM: 1,
  vmName: "Test VM",
  vCPU: 2,
  ram: 8,
  disk: 50,
  hasBackup: false,
  status: "RUNNING",
  os: "ubuntu2404",
  pass: "StrongPassword123!",
  location: "usa_miami",
  networkType: "public",
};

vi.mock("../../../src/stores/useZMyVMsList", () => ({
  useZMyVMsList: () => ({
    currentVM: mockCurrentVM,
    setCurrentVM: mockSetCurrentVM,
  }),
}));

vi.mock("../../../src/hooks/useVmResource", () => ({
  useVmResource: () => ({
    updateVM: mockUpdateVM,
    updateVMStatus: mockUpdateVMStatus,
    deleteVM: mockDeleteVM,
    validPassword: vi.fn().mockReturnValue(true),
    storageOptions: [{ label: "SSD", value: "ssd" }],
    localizationOptions: [{ label: "Miami", value: "usa_miami" }],
    isLoadingDeleteVM: false,
    isLoadingUpdateVM: false,
    getNetworkType: () => ({ label: "Public", value: "public" }),
  }),
}));

vi.mock("../../../src/hooks/useStatusInfo", () => ({
  useStatusInfo: () => ({
    statusHashMap: {
      RUNNING: "Em execução",
      STOPPED: "Parado",
      PAUSED: "Pausado",
    },
  }),
}));

vi.mock("../../../src/stores/useZTheme", () => ({
  useZTheme: () => ({
    mode: "light",
    theme: {
      light: {
        blue: "#0000FF",
        primary: "#000000",
        mainBackground: "#FFFFFF",
        gray: "#808080",
        grayLight: "#F0F0F0",
        btnText: "#FFFFFF",
        black: "#000000",
        greenLight: "#00FF00",
        lightRed: "#FF0000",
        danger: "#FF0000",
        blueDark: "#0000CC",
      },
    },
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Interfaces para props dos mocks
interface LabelInputVMProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

interface DropDownTextProps {
  label: string;
  disabled?: boolean;
}

interface SliderLabelNumProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

interface CheckboxLabelProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

// Mock componentes complexos
vi.mock("../../../src/pages/VirtualMachine/components/LabelInputVM", () => ({
  LabelInputVM: ({ label, value, onChange, disabled }: LabelInputVMProps) => (
    <div data-testid={`input-${label}`}>
      <label>{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
        data-testid={`input-field-${label}`}
      />
    </div>
  ),
}));

vi.mock("../../../src/pages/VirtualMachine/components/DropDowText", () => ({
  DropDowText: ({ label, disabled }: DropDownTextProps) => (
    <div data-testid={`dropdown-${label}`}>
      <label>{label}</label>
      <select disabled={disabled}>
        <option>Select</option>
      </select>
    </div>
  ),
}));

vi.mock("../../../src/pages/VirtualMachine/components/SliderLabelNum", () => ({
  SliderLabelNum: ({ label, value, onChange }: SliderLabelNumProps) => (
    <div data-testid={`slider-${label}`}>
      <label>{label}</label>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        data-testid={`slider-field-${label}`}
      />
      <span>{value}</span>
    </div>
  ),
}));

vi.mock("../../../src/pages/VirtualMachine/components/CheckboxLabel", () => ({
  CheckboxLabel: ({ label, value, onChange }: CheckboxLabelProps) => (
    <div data-testid={`checkbox-${label}`}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        data-testid={`checkbox-field-${label}`}
      />
      <label>{label}</label>
    </div>
  ),
}));

vi.mock(
  "../../../src/pages/VirtualMachine/components/PasswordValidations",
  () => ({
    PasswordValidations: () => <div data-testid="password-validations" />,
  }),
);

vi.mock("../../../src/pages/MyVMs/components/ModalDeleteVM", () => ({
  ModalDeleteVM: () => null,
}));

vi.mock("../../../src/pages/MyVMs/components/ModalStartVM", () => ({
  ModalStartVM: () => null,
}));

vi.mock("../../../src/pages/MyVMs/components/ModalStopVM", () => ({
  ModalStopVM: () => null,
}));

vi.mock(
  "../../../src/pages/VirtualMachine/components/ModalConfirmCreate",
  () => ({
    ModalConfirmCreate: () => null,
  }),
);

vi.mock("../../../src/components/AbsoluteBackDrop", () => ({
  AbsoluteBackDrop: () => null,
}));

describe("FormEditVM", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the edit form title", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    expect(screen.getByText("createVm.vmEdit")).toBeInTheDocument();
  });

  it("should display VM name in input", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    const nameInput = screen.getByTestId("input-field-createVm.vmName");
    expect(nameInput).toHaveValue("Test VM");
  });

  it("should display VM password in input", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    const passwordInput = screen.getByTestId("input-field-createVm.password");
    expect(passwordInput).toHaveValue("StrongPassword123!");
  });

  it("should allow editing VM name", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    const nameInput = screen.getByTestId("input-field-createVm.vmName");

    fireEvent.change(nameInput, { target: { value: "New VM Name" } });

    expect(nameInput).toHaveValue("New VM Name");
  });

  it("should display vCPU slider with current value", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    const cpuSlider = screen.getByTestId("slider-createVm.cpu");
    expect(cpuSlider).toBeInTheDocument();
    expect(cpuSlider).toHaveTextContent("2");
  });

  it("should display RAM slider with current value", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    const ramSlider = screen.getByTestId("slider-createVm.memory");
    expect(ramSlider).toBeInTheDocument();
    expect(ramSlider).toHaveTextContent("8");
  });

  it("should display disk slider with current value", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    const diskSlider = screen.getByTestId("slider-createVm.disk");
    expect(diskSlider).toBeInTheDocument();
    expect(diskSlider).toHaveTextContent("50");
  });

  it("should display backup checkbox", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    const backupCheckbox = screen.getByTestId("checkbox-createVm.autoBackup");
    expect(backupCheckbox).toBeInTheDocument();
  });

  it("should toggle backup checkbox", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    const checkboxField = screen.getByTestId(
      "checkbox-field-createVm.autoBackup",
    );

    expect(checkboxField).not.toBeChecked();
    fireEvent.click(checkboxField);
    expect(checkboxField).toBeChecked();
  });

  it("should have edit and delete buttons", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    expect(screen.getByText("createVm.edit")).toBeInTheDocument();
    expect(screen.getByText("createVm.deleteVM")).toBeInTheDocument();
  });

  it("should display start button", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    expect(screen.getByText("home.start")).toBeInTheDocument();
  });

  it("should display stop button", () => {
    render(<FormEditVM onClose={mockOnClose} />);
    expect(screen.getByText("home.stop")).toBeInTheDocument();
  });
});
