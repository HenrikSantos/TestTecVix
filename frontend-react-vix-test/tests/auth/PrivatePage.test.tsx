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

  describe("unauthenticated user", () => {
    it("should redirect to /login when token is missing", async () => {
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

    it("should reset states when user has no token", async () => {
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

    it("should show skeleton while checking authentication", () => {
      mockToken = null;

      render(
        <PrivatePage>
          <div>Conteudo protegido</div>
        </PrivatePage>,
      );

      expect(screen.getByTestId("full-page-skeleton")).toBeInTheDocument();
    });
  });

  describe("authenticated user", () => {
    it("should render children when user has a token", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "member";

      render(
        <PrivatePage>
          <div data-testid="protected-content">Conteudo protegido</div>
        </PrivatePage>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      });
    });

    it("should not redirect when user has a valid token", async () => {
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

  describe("onlyAdmin restriction", () => {
    it("should allow access when user is admin", async () => {
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

    it("should redirect when user is not admin", async () => {
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

    it("should redirect manager when onlyAdmin is true", async () => {
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

  describe("onlyManagerOrAdmin restriction", () => {
    it("should allow access when user is admin", async () => {
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

    it("should allow access when user is manager", async () => {
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

    it("should redirect when user is member", async () => {
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

  describe("restriction combination", () => {
    it("should check onlyAdmin before onlyManagerOrAdmin", async () => {
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

  describe("loading state", () => {
    it("should show skeleton while checking permissions", async () => {
      mockToken = "valid-jwt-token";
      mockRole = "admin";

      render(
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
