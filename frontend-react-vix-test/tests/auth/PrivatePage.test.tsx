import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { PrivatePage } from "../../src/auth/PrivatePage";
import "@testing-library/jest-dom/vitest";

const mockNavigate = vi.fn();
const mockResetAllStates = vi.fn();
let mockToken: string | null = null;
let mockRole: "admin" | "manager" | "member" | null = null;

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../src/stores/useZResetAllStates", () => ({
  useZResetAllStates: () => ({
    resetAllStates: mockResetAllStates,
  }),
}));

vi.mock("../../src/stores/useZUserProfile", () => ({
  useZUserProfile: () => ({
    token: mockToken,
    role: mockRole,
  }),
}));

vi.mock("../../src/components/Skeletons/FullPage", () => ({
  FullPage: () => <div data-testid="full-page-skeleton">Loading...</div>,
}));

describe("PrivatePage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToken = null;
    mockRole = null;
  });

  describe("usuario nao autenticado", () => {
    it("deve redirecionar para /login quando token nao existe", async () => {
      mockToken = null;

      render(
        <PrivatePage>
          <div>Conteudo protegido</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });

    it("deve resetar estados quando usuario nao tem token", async () => {
      mockToken = null;

      render(
        <PrivatePage>
          <div>Conteudo protegido</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(mockResetAllStates).toHaveBeenCalled();
      });
    });

    it("deve mostrar skeleton enquanto verifica autenticacao", () => {
      mockToken = null;

      render(
        <PrivatePage>
          <div>Conteudo protegido</div>
        </PrivatePage>,
      );

      expect(screen.getByTestId("full-page-skeleton")).toBeInTheDocument();
    });
  });

  describe("usuario autenticado", () => {
    it("deve renderizar children quando usuario tem token", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "member";

      render(
        <PrivatePage>
          <div data-testid="protected-content">Conteudo protegido</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("protected-content"),
        ).toBeInTheDocument();
      });
    });

    it("nao deve redirecionar quando usuario tem token valido", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "member";

      render(
        <PrivatePage>
          <div>Conteudo protegido</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalledWith("/login");
      });
    });
  });

  describe("restricao onlyAdmin", () => {
    it("deve permitir acesso quando usuario e admin", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "admin";

      render(
        <PrivatePage onlyAdmin>
          <div data-testid="admin-content">Conteudo Admin</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("admin-content")).toBeInTheDocument();
      });
    });

    it("deve redirecionar quando usuario nao e admin", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "member";

      render(
        <PrivatePage onlyAdmin>
          <div>Conteudo Admin</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });

    it("deve redirecionar manager quando onlyAdmin e true", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "manager";

      render(
        <PrivatePage onlyAdmin>
          <div>Conteudo Admin</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });

  describe("restricao onlyManagerOrAdmin", () => {
    it("deve permitir acesso quando usuario e admin", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "admin";

      render(
        <PrivatePage onlyManagerOrAdmin>
          <div data-testid="manager-content">Conteudo Manager</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("manager-content")).toBeInTheDocument();
      });
    });

    it("deve permitir acesso quando usuario e manager", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "manager";

      render(
        <PrivatePage onlyManagerOrAdmin>
          <div data-testid="manager-content">Conteudo Manager</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("manager-content")).toBeInTheDocument();
      });
    });

    it("deve redirecionar quando usuario e member", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "member";

      render(
        <PrivatePage onlyManagerOrAdmin>
          <div>Conteudo Manager</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });

  describe("combinacao de restricoes", () => {
    it("deve verificar onlyAdmin antes de onlyManagerOrAdmin", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "manager";

      render(
        <PrivatePage onlyAdmin onlyManagerOrAdmin>
          <div>Conteudo Restrito</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(-1);
      });
    });
  });

  describe("estado de loading", () => {
    it("deve mostrar skeleton durante verificacao de permissoes", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "admin";

      const { container } = render(
        <PrivatePage onlyAdmin>
          <div data-testid="content">Conteudo</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("content")).toBeInTheDocument();
      });
    });
  });
});
