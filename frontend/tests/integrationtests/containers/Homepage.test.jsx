import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Homepage from "../../../src/containers/Homepage";

describe("Homepage", () => {
  it("renders correctly", () => {
    const rendered = render(<Homepage />);
    expect(rendered.getByRole("paragraph")).toBeInTheDocument();
  });
});
