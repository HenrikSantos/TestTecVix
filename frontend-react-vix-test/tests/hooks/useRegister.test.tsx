import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useRegister } from "../../src/hooks/useRegister";

const mockNavigate = vi.fn();
const mockPost = vi.fn();
const mockToastError = vi.fn();
const mockIdBrand = 1;

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "loginRegister.invalidEmail": "Email invalido",
        "loginRegister.invalidPassword": "Senha invalida",
        "loginRegister.passwordMismatch": "Senhas nao conferem",
        "loginRegister.invalidUsername": "Username invalido",
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock("../../src/stores/useZBrandStore", () => ({
  useZBrandInfo: () => ({
    idBrand: mockIdBrand,
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

describe("useRegister Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("goRegister", () => {
    const validData = {
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
      confirmPassword: "password123",
    };

    it("deve registrar usuario com sucesso", async () => {
      mockPost.mockResolvedValue({
        error: false,
        data: { idUser: 1, username: "newuser" },
      });

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister(validData);
      });

      expect(mockPost).toHaveBeenCalledWith({
        url: "/user",
        data: {
          username: validData.username,
          password: validData.password,
          email: validData.email,
          idBrandMaster: mockIdBrand,
        },
      });
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("deve mostrar erro quando username esta vazio", async () => {
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          ...validData,
          username: "",
        });
      });

      expect(mockToastError).toHaveBeenCalledWith("Username invalido");
      expect(mockPost).not.toHaveBeenCalled();
    });

    it("deve mostrar erro quando email e invalido", async () => {
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          ...validData,
          email: "invalid-email",
        });
      });

      expect(mockToastError).toHaveBeenCalledWith("Email invalido");
      expect(mockPost).not.toHaveBeenCalled();
    });

    it("deve mostrar erro quando email esta vazio", async () => {
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          ...validData,
          email: "",
        });
      });

      expect(mockToastError).toHaveBeenCalledWith("Email invalido");
      expect(mockPost).not.toHaveBeenCalled();
    });

    it("deve mostrar erro quando senha esta vazia", async () => {
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          ...validData,
          password: "",
        });
      });

      expect(mockToastError).toHaveBeenCalledWith("Senha invalida");
      expect(mockPost).not.toHaveBeenCalled();
    });

    it("deve mostrar erro quando senhas nao conferem", async () => {
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          ...validData,
          confirmPassword: "differentpassword",
        });
      });

      expect(mockToastError).toHaveBeenCalledWith("Senhas nao conferem");
      expect(mockPost).not.toHaveBeenCalled();
    });

    it("deve mostrar erro quando API retorna erro", async () => {
      mockPost.mockResolvedValue({
        error: true,
        message: "Email already exists",
      });

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister(validData);
      });

      expect(mockToastError).toHaveBeenCalledWith("Email already exists");
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("deve enviar idBrandMaster do store", async () => {
      mockPost.mockResolvedValue({ error: false, data: {} });

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister(validData);
      });

      expect(mockPost).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            idBrandMaster: mockIdBrand,
          }),
        }),
      );
    });

    it("deve redirecionar para /login apos registro bem-sucedido", async () => {
      mockPost.mockResolvedValue({ error: false, data: {} });

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister(validData);
      });

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("nao deve redirecionar quando registro falha", async () => {
      mockPost.mockResolvedValue({
        error: true,
        message: "Registration failed",
      });

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister(validData);
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("validacao de email", () => {
    it("deve aceitar email valido com dominio comum", async () => {
      mockPost.mockResolvedValue({ error: false, data: {} });

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          username: "user",
          email: "user@gmail.com",
          password: "password123",
          confirmPassword: "password123",
        });
      });

      expect(mockPost).toHaveBeenCalled();
    });

    it("deve aceitar email valido com subdominio", async () => {
      mockPost.mockResolvedValue({ error: false, data: {} });

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          username: "user",
          email: "user@mail.company.com",
          password: "password123",
          confirmPassword: "password123",
        });
      });

      expect(mockPost).toHaveBeenCalled();
    });

    it("deve rejeitar email sem @", async () => {
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          username: "user",
          email: "userexample.com",
          password: "password123",
          confirmPassword: "password123",
        });
      });

      expect(mockToastError).toHaveBeenCalledWith("Email invalido");
      expect(mockPost).not.toHaveBeenCalled();
    });

    it("deve rejeitar email sem dominio", async () => {
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.goRegister({
          username: "user",
          email: "user@",
          password: "password123",
          confirmPassword: "password123",
        });
      });

      expect(mockToastError).toHaveBeenCalledWith("Email invalido");
      expect(mockPost).not.toHaveBeenCalled();
    });
  });
});
