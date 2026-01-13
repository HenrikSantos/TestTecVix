import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DropDrownLabel } from "../../../src/components/Inputs/DropDrownLabel";

vi.mock("../../../src/stores/useZTheme", () => ({
  useZTheme: () => ({
    mode: "light",
    theme: {
      light: {
        primary: "#000000",
        mainBackground: "#FFFFFF",
        grayLight: "#F0F0F0",
        danger: "#FF0000",
        blue: "#0000FF",
      },
    },
  }),
}));

vi.mock("../../../src/components/TextL", () => ({
  TextRob16FontL: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("../../../src/utils/shadow", () => ({
  shadow: () => "#000000",
}));

vi.mock("../../../src/icons/CloseXIcon", () => ({
  CloseXIcon: () => <span />,
}));

describe("DropDrownLabel", () => {
  it("should render placeholder in the input", () => {
    render(
      <DropDrownLabel
        label="Timezone"
        placeholder="Select a timezone"
        data={[
          { label: "UTC", value: "UTC" },
          { label: "America/Sao_Paulo", value: "America/Sao_Paulo" },
        ]}
        value={null}
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByPlaceholderText("Select a timezone"),
    ).toBeInTheDocument();
  });
});
