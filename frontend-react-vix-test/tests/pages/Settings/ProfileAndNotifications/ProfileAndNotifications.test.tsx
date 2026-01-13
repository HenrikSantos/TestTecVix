import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileAndNotifications } from "../../../../src/pages/Settings/components/ProfileAndNotifications";

let mockRole = "admin";
let mockIdBrand: number | null = null;

vi.mock("../../../../src/stores/useZTheme", () => ({
  useZTheme: () => ({
    mode: "light",
    theme: {
      light: {
        mainBackground: "#FFFFFF",
        grayLight: "#EEEEEE",
      },
    },
  }),
}));

vi.mock("../../../../src/stores/useZUserProfile", () => ({
  useZUserProfile: () => ({
    role: mockRole,
    idBrand: mockIdBrand,
  }),
}));

vi.mock(
  "../../../../src/pages/Settings/components/ProfileAndNotifications/components/PersonalInformation",
  () => ({
    PersonalInformation: () => <div data-testid="personal-information" />,
  }),
);

vi.mock(
  "../../../../src/pages/Settings/components/ProfileAndNotifications/components/NotificationsContact",
  () => ({
    NotificationsContact: () => <div data-testid="notifications-contact" />,
  }),
);

vi.mock(
  "../../../../src/pages/Settings/components/ProfileAndNotifications/components/CTAsButtons",
  () => ({
    CTAsButtons: () => <div data-testid="ctas-buttons" />,
  }),
);

describe("ProfileAndNotifications", () => {
  beforeEach(() => {
    mockRole = "admin";
    mockIdBrand = null;
  });

  it("nao exibe notificacoes quando idBrand esta ausente", () => {
    render(<ProfileAndNotifications />);

    expect(
      screen.queryByTestId("notifications-contact"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("personal-information")).toBeInTheDocument();
  });

  it("exibe notificacoes quando role permitido e idBrand presente", () => {
    mockIdBrand = 10;
    render(<ProfileAndNotifications />);

    expect(screen.getByTestId("notifications-contact")).toBeInTheDocument();
  });
});
