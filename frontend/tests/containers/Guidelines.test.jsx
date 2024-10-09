import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Guidelines from "../../src/containers/Guidelines";

describe("Guidelines", () => {
  it("renders correctly", () => {
    render(<Guidelines />);
    expect(screen.getByText("Guidelines")).toBeVisible();
  });
});
