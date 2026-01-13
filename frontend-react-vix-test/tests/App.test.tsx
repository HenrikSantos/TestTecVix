import React from "react";
import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter } from "react-router-dom";
import App from "../src/App";
import "@testing-library/jest-dom/vitest";

vi.mock("../src/routes/_index", () => ({
  appRoutes: createMemoryRouter(
    [
      {
        path: "/",
        element: React.createElement(
          "div",
          { "data-testid": "app-root" },
          "App",
        ),
      },
    ],
    { initialEntries: ["/"] },
  ),
}));

describe("App", () => {
  it("should match snapshot", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it("renders the routed content", () => {
    render(<App />);
    expect(screen.getByTestId("app-root")).toBeInTheDocument();
  });
});
