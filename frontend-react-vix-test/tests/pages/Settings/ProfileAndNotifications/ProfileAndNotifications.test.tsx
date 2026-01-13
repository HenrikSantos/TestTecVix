import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
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

  it("should not show notifications when idBrand is missing", () => {
    render(<ProfileAndNotifications />);

    expect(
      screen.queryByTestId("notifications-contact"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("personal-information")).toBeInTheDocument();
  });

  it("should show notifications when role is allowed and idBrand is present", () => {
    mockIdBrand = 10;
    render(<ProfileAndNotifications />);

    expect(screen.getByTestId("notifications-contact")).toBeInTheDocument();
  });
});
