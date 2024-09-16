import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Home from "../../../src/containers/Home";

describe("Home", () => {
  it("renders correctly", () => {
    const rendered = render(<Home />);
    expect(rendered.getByRole("paragraph")).toBeInTheDocument();
  });
});
