import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import AboutUs from "../../src/containers/AboutUs";
import { BrowserRouter } from "react-router-dom";

describe("about us container", () => {
  it("returns a paragraph with content", () => {
    render(
      <BrowserRouter>
        <AboutUs />
      </BrowserRouter>,
    );
    expect(screen.getAllByRole("paragraph")).toHaveLength(2);
    expect(screen.getByText("About Us")).toBeVisible();
  });
});
