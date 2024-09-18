import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import AboutUs from "../../src/containers/AboutUs";

describe("about us container", () => {
  it("returns a paragraph with content", () => {
    render(<AboutUs />);
    expect(screen.getByRole("paragraph")).toBeInTheDocument();
  });
});
