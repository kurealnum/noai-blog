import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Dashboard from "../../../src/containers/Dashboard";

describe("Dashboard", () => {
  it("renders correctly", () => {
    const rendered = render(<Dashboard />);
    expect(rendered.getByText("Your comments")).toBeDefined();
    expect(rendered.getByText("Your posts")).toBeDefined();
  });
  it.skip("comments render correctly");
});
