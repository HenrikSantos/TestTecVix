import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useLogin } from "../../src/hooks/useLogin";

const mockNavigate = vi.fn();
const mockSetUser = vi.fn();
const mockSetLoginTime = vi.fn();
const mockSetIsOpenModalUserNotActive = vi.fn();
const mockResetAllStates = vi.fn();
const mockPost = vi.fn();
const mockToastError = vi.fn();
const mockSetBrandInfo = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../src/stores/useZGlobalVar", () => ({
  useZGlobalVar: () => ({
    setIsOpenModalUserNotActive: mockSetIsOpenModalUserNotActive,
    setLoginTime: mockSetLoginTime,
  }),
}));

vi.mock("../../src/stores/useZUserProfile", () => ({
  useZUserProfile: () => ({
    setUser: mockSetUser,
  }),
}));

vi.mock("../../src/stores/useZBrandStore", () => ({
  useZBrandInfo: () => ({
    setBrandInfo: mockSetBrandInfo,
  }),
}));

vi.mock("../../src/stores/useZResetAllStates", () => ({
  useZResetAllStates: () => ({
    resetAllStates: mockResetAllStates,
  }),
}));

vi.mock("../../src/services/api", () => ({
  api: {
    post: (params: unknown) => mockPost(params),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: (message: string) => mockToastError(message),
  },
}));

describe("useLogin Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("goLogin", () => {
    it("should log in successfully using email", async () => {
      const mockResponse = {
        error: false,
        data: {
          token: "jwt-token-123",
          user: {
            idUser: 1,
            username: "testuser",
            email: "test@example.com",
            profileImgUrl: null,
            role: "admin",
            idBrandMaster: 1,
            isActive: true,
            userPhoneNumber: null,
            fullName: "Test User",
          },
          brandMaster: {
            emailContact: "contact@example.com",
            smsContact: "999999999",
            timezone: "UTC",
          },
        },
      };
      mockPost.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.goLogin({
          username: "",
          password: "password123",
          email: "test@example.com",
        });
      });

      expect(mockPost).toHaveBeenCalledWith({
        url: "/user/login",
        data: {
          username: undefined,
          password: "password123",
          email: "test@example.com",
        },
        tryRefetch: true,
      });
      expect(mockSetUser).toHaveBeenCalled();
      expect(mockSetBrandInfo).toHaveBeenCalledWith({
        emailContact: "contact@example.com",
        smsContact: "999999999",
        timezone: "UTC",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should log in successfully using username", async () => {
      const mockResponse = {
        error: false,
        data: {
          token: "jwt-token-123",
          user: {
            idUser: 1,
            username: "testuser",
            email: "test@example.com",
            profileImgUrl: null,
            role: "member",
            idBrandMaster: null,
            isActive: true,
            userPhoneNumber: null,
            fullName: "Test User",
          },
          brandMaster: null,
        },
      };
      mockPost.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.goLogin({
          username: "testuser",
          password: "password123",
          email: "",
        });
      });

      expect(mockPost).toHaveBeenCalledWith({
        url: "/user/login",
        data: {
          username: "testuser",
          password: "password123",
          email: undefined,
        },
        tryRefetch: true,
      });
      expect(mockSetUser).toHaveBeenCalled();
      expect(mockSetBrandInfo).toHaveBeenCalledWith({
        emailContact: "",
        smsContact: "",
        timezone: "",
      });
    });

    it("should not log in without username or email", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.goLogin({
          username: "",
          password: "password123",
          email: "",
        });
      });

      expect(mockPost).not.toHaveBeenCalled();
    });

    it("should not log in without password", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.goLogin({
          username: "testuser",
          password: "",
          email: "",
        });
      });

      expect(mockPost).not.toHaveBeenCalled();
    });

    it("should show error when login fails", async () => {
      mockPost.mockResolvedValue({
        error: true,
        message: "Invalid credentials",
      });

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.goLogin({
          username: "testuser",
          password: "wrongpassword",
          email: "",
        });
      });

      expect(mockToastError).toHaveBeenCalledWith("Invalid credentials");
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should open modal when user is not active", async () => {
      mockPost.mockResolvedValue({
        error: false,
        data: {
          token: "jwt-token",
          user: {
            idUser: 1,
            isActive: false,
          },
        },
      });

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.goLogin({
          username: "inactiveuser",
          password: "password123",
          email: "",
        });
      });

      expect(mockSetIsOpenModalUserNotActive).toHaveBeenCalledWith(true);
      expect(mockSetUser).not.toHaveBeenCalled();
    });

    it("should store user data after login", async () => {
      const mockUserData = {
        idUser: 1,
        username: "testuser",
        email: "test@example.com",
        profileImgUrl: "http://example.com/img.jpg",
        role: "admin",
        idBrandMaster: 5,
        isActive: true,
        userPhoneNumber: "+55119999999",
        fullName: "Test User",
      };

      mockPost.mockResolvedValue({
        error: false,
        data: {
          token: "jwt-token-123",
          user: mockUserData,
          brandMaster: null,
        },
      });

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.goLogin({
          username: "testuser",
          password: "password123",
          email: "",
        });
      });

      expect(mockSetUser).toHaveBeenCalledWith({
        idUser: mockUserData.idUser,
        profileImgUrl: mockUserData.profileImgUrl,
        imageUrl: mockUserData.profileImgUrl,
        username: mockUserData.username,
        fullName: mockUserData.fullName,
        userEmail: mockUserData.email,
        idBrand: mockUserData.idBrandMaster,
        token: "jwt-token-123",
        role: mockUserData.role,
        userPhoneNumber: mockUserData.userPhoneNumber,
      });
    });

    it("should set loginTime after successful login", async () => {
      mockPost.mockResolvedValue({
        error: false,
        data: {
          token: "jwt-token",
          user: { idUser: 1, isActive: true },
        },
      });

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.goLogin({
          username: "testuser",
          password: "password123",
          email: "",
        });
      });

      expect(mockSetLoginTime).toHaveBeenCalled();
    });

    it("should handle loading state during login", async () => {
      mockPost.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  error: false,
                  data: { token: "token", user: { isActive: true } },
                }),
              100,
            ),
          ),
      );

      const { result } = renderHook(() => useLogin());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.goLogin({
          username: "testuser",
          password: "password123",
          email: "",
        });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("goLogout", () => {
    it("should log out and redirect to /login", () => {
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.goLogout();
      });

      expect(mockResetAllStates).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should clear all states on logout", () => {
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.goLogout();
      });

      expect(mockResetAllStates).toHaveBeenCalledTimes(1);
    });
  });
});
