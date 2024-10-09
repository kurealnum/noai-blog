import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Home from "../../src/containers/Home";

describe("Home", () => {
  it("renders correctly", () => {
    render(<Home />);
    expect(screen.getByText("robots")).toBeVisible();
    expect(screen.getByText("blogs")).toBeVisible();
  });
});
