import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CTAsButtons } from "../../../../src/pages/Settings/components/ProfileAndNotifications/components/CTAsButtons";

const mockSetFormProfileNotifications = vi.fn();
const mockSetUser = vi.fn();
const mockSetBrandInfo = vi.fn();
const mockPut = vi.fn();
const mockToastError = vi.fn();
const mockToastSuccess = vi.fn();

const defaultFormState = {
  fullNameForm: { value: "Full Name", errorMessage: "" },
  userName: { value: "username", errorMessage: "" },
  userEmail: { value: "user@example.com", errorMessage: "" },
  userPhone: { value: "11999999999", errorMessage: "" },
  password: { value: "", errorMessage: "" },
  confirmPassword: { value: "", errorMessage: "" },
  companyEmail: { value: "company@example.com", errorMessage: "" },
  companySMS: { value: "11999999999", errorMessage: "" },
  timeZone: { value: "UTC", errorMessage: "" },
  setFormProfileNotifications: mockSetFormProfileNotifications,
};

const defaultUserState = {
  idUser: 1,
  imageUrl: "https://example.com/new.png",
  profileImgUrl: "https://example.com/old.png",
  setUser: mockSetUser,
  fullName: "Stored Name",
  username: "storedUser",
  userEmail: "stored@example.com",
  userPhoneNumber: "11911111111",
  role: "member",
  idBrand: null as number | null,
};

const defaultBrandState = {
  emailContact: "stored@brand.com",
  smsContact: "11922222222",
  timezone: "America/Sao_Paulo",
  setBrandInfo: mockSetBrandInfo,
};

let mockFormState = { ...defaultFormState };
let mockUserState = { ...defaultUserState };
let mockBrandState = { ...defaultBrandState };

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
        blue: "#0000FF",
        blueDark: "#0000CC",
        btnText: "#FFFFFF",
      },
    },
  }),
}));

vi.mock("../../../../src/components/TextL", () => ({
  TextRob16FontL: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("../../../../src/stores/useZFormProfileNotifications", () => ({
  useZFormProfileNotifications: () => mockFormState,
}));

vi.mock("../../../../src/stores/useZUserProfile", () => ({
  useZUserProfile: () => mockUserState,
}));

vi.mock("../../../../src/stores/useZBrandStore", () => ({
  useZBrandInfo: () => mockBrandState,
}));

vi.mock("../../../../src/services/api", () => ({
  api: {
    put: (params: unknown) => mockPut(params),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: (message: string) => mockToastError(message),
    success: (message: string) => mockToastSuccess(message),
  },
}));

describe("CTAsButtons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFormState = { ...defaultFormState };
    mockUserState = { ...defaultUserState };
    mockBrandState = { ...defaultBrandState };
  });

  it("should show error when full name is invalid", async () => {
    mockFormState.fullNameForm = { value: "Ab", errorMessage: "" };

    render(<CTAsButtons />);

    fireEvent.click(screen.getByText("profileAndNotifications.saveChanges"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "profileAndNotifications.errorForm",
      );
    });
    expect(mockPut).not.toHaveBeenCalled();
  });

  it("should show error when passwords do not match", async () => {
    mockFormState.password = { value: "123", errorMessage: "" };
    mockFormState.confirmPassword = { value: "456", errorMessage: "" };

    render(<CTAsButtons />);

    fireEvent.click(screen.getByText("profileAndNotifications.saveChanges"));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        "colaboratorRegister.dontMatch",
      );
    });
    expect(mockPut).not.toHaveBeenCalled();
  });

  it("should save user and brand data when admin", async () => {
    mockUserState = {
      ...mockUserState,
      role: "admin",
      idBrand: 10,
    };
    mockFormState = {
      ...mockFormState,
      fullNameForm: { value: "New Name", errorMessage: "" },
      userName: { value: "newuser", errorMessage: "" },
      userEmail: { value: "new@example.com", errorMessage: "" },
      userPhone: { value: "11900000000", errorMessage: "" },
      password: { value: "newpass", errorMessage: "" },
      confirmPassword: { value: "newpass", errorMessage: "" },
      companyEmail: { value: "contact@brand.com", errorMessage: "" },
      companySMS: { value: "11988888888", errorMessage: "" },
      timeZone: { value: "UTC", errorMessage: "" },
    };

    mockPut
      .mockResolvedValueOnce({
        error: false,
        data: {
          fullName: "New Name",
          username: "newuser",
          email: "new@example.com",
          userPhoneNumber: "11900000000",
          profileImgUrl: "https://example.com/new.png",
        },
      })
      .mockResolvedValueOnce({
        error: false,
        data: {
          emailContact: "contact@brand.com",
          smsContact: "11988888888",
          timezone: "UTC",
        },
      });

    render(<CTAsButtons />);

    fireEvent.click(screen.getByText("profileAndNotifications.saveChanges"));

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledTimes(2);
    });

    expect(mockPut.mock.calls[0][0]).toEqual({
      url: "/user/1",
      data: expect.objectContaining({
        fullName: "New Name",
        username: "newuser",
        email: "new@example.com",
        userPhoneNumber: "11900000000",
        profileImgUrl: "https://example.com/new.png",
        password: "newpass",
      }),
    });
    expect(mockPut.mock.calls[1][0]).toEqual({
      url: "/brand-master/10",
      data: {
        emailContact: "contact@brand.com",
        smsContact: "11988888888",
        timezone: "UTC",
      },
    });
    expect(mockSetUser).toHaveBeenCalledWith({
      fullName: "New Name",
      username: "newuser",
      userEmail: "new@example.com",
      userPhoneNumber: "11900000000",
      profileImgUrl: "https://example.com/new.png",
      imageUrl: "https://example.com/new.png",
    });
    expect(mockSetBrandInfo).toHaveBeenCalledWith({
      emailContact: "contact@brand.com",
      smsContact: "11988888888",
      timezone: "UTC",
    });
    expect(mockToastSuccess).toHaveBeenCalledWith("generic.dataSavesuccess");
  });

  it("should reset form with store data", () => {
    render(<CTAsButtons />);

    fireEvent.click(
      screen.getByText("profileAndNotifications.redefineAllData"),
    );

    expect(mockSetFormProfileNotifications).toHaveBeenCalledWith({
      fullNameForm: { value: "Stored Name", errorMessage: "" },
      userName: { value: "storedUser", errorMessage: "" },
      userEmail: { value: "stored@example.com", errorMessage: "" },
      userPhone: { value: "11911111111", errorMessage: "" },
      password: { value: "", errorMessage: "" },
      confirmPassword: { value: "", errorMessage: "" },
      companyEmail: { value: "stored@brand.com", errorMessage: "" },
      companySMS: { value: "11922222222", errorMessage: "" },
      timeZone: { value: "America/Sao_Paulo", errorMessage: "" },
    });
  });
});
