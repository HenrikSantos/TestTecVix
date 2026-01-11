import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormVM } from "../../../src/pages/VirtualMachine/components/FormVM";
import "@testing-library/jest-dom/vitest";

// Mock hooks
const setVmSO = vi.fn();
const setVmPassword = vi.fn();
const setVmName = vi.fn();
const setVmvCpu = vi.fn();
const setVmMemory = vi.fn();
const setVmDisk = vi.fn();
const setVmLocalization = vi.fn();
const setHasBackup = vi.fn();
const setVmNetwork = vi.fn();
const setOpenConfirm = vi.fn();

vi.mock("../../../src/stores/useZVM", () => ({
  useZVM: () => ({
    vmSO: null,
    setVmSO,
    vmPassword: "StrongPassword123!",
    setVmPassword,
    vmName: "",
    setVmName,
    vmvCpu: 1,
    setVmvCpu,
    vmMemory: 1,
    setVmMemory,
    vmDisk: 20,
    setVmDisk,
    vmLocalization: null,
    setVmLocalization,
    hasBackup: false,
    setHasBackup,
    vmNetwork: null,
    setVmNetwork,
    openConfirm: false,
    setOpenConfirm,
  }),
}));

vi.mock("../../../src/hooks/useVmResource", () => ({
  useVmResource: () => ({
    createVm: vi.fn(),
    validPassword: vi.fn().mockReturnValue(true),
    storageOptions: [{ label: "SSD", value: "ssd" }],
    localizationOptions: [{ label: "Miami", value: "usa_miami" }],
    networkTypeOptions: [{ label: "Public", value: "public" }],
    isLoadingCreateVM: false,
  }),
}));

vi.mock("../../../src/stores/useZVMSugestion", async () => {
  const actual = await vi.importActual("../../../src/stores/useZVMSugestion");
  return {
    ...actual,
    useZVMSugestion: () => ({
      os: null,
      vCPU: null,
      ram: null,
      disk: null,
      resetAll: vi.fn(),
    }),
  };
});

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
interface DropDownOption {
  label: string;
  value: string;
}

interface DropDowTextProps {
  label: string;
  data: DropDownOption[];
  onChange: (selected: DropDownOption | undefined) => void;
}

// Mock DropDowText to avoid MUI complexity in unit test and focus on props
vi.mock("../../../src/pages/VirtualMachine/components/DropDowText", () => ({
  DropDowText: ({ label, data, onChange }: DropDowTextProps) => (
    <div data-testid={`dropdown-${label}`}>
      <label>{label}</label>
      <select
        onChange={(e) => {
          const selected = data.find(
            (d: DropDownOption) => d.value === e.target.value,
          );
          onChange(selected);
        }}
      >
        <option value="">Select</option>
        {data.map((d: DropDownOption) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe("FormVM", () => {
  it("should render correctly", () => {
    render(<FormVM />);
    expect(screen.getByText("createVm.vmRegister")).toBeInTheDocument();
    expect(
      screen.getByTestId("dropdown-createVm.operationalSystem"),
    ).toBeInTheDocument();
  });

  it("should have OS options in the dropdown", () => {
    render(<FormVM />);
    const osDropdown = screen.getByTestId(
      "dropdown-createVm.operationalSystem",
    );
    const options = osDropdown.querySelectorAll("option");
    // Check if we have options populated (more than just "Select")
    expect(options.length).toBeGreaterThan(1);
    expect(Array.from(options).some((opt) => opt.value === "ubuntu2404")).toBe(
      true,
    );
  });

  it("should call setVmSO when OS is selected", () => {
    render(<FormVM />);
    const osDropdown = screen.getByTestId(
      "dropdown-createVm.operationalSystem",
    );
    const select = osDropdown.querySelector("select");
    fireEvent.change(select!, { target: { value: "ubuntu2404" } });

    expect(setVmSO).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "ubuntu2404",
        value: "ubuntu2404",
      }),
    );
  });
});
