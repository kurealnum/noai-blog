import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import AboutUs from "../../src/containers/AboutUs";

describe("about us container", () => {
  it("returns a paragraph with content", () => {
    const rendered = render(<AboutUs />);
    expect(rendered.getByRole("paragraph")).toBeInTheDocument();
  });
});
