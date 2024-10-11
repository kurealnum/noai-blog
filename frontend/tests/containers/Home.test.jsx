import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Home from "../../src/containers/Home";
import { BrowserRouter } from "react-router-dom";

describe("Home", () => {
  it("renders correctly", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    expect(screen.getByText("robots")).toBeVisible();
    expect(screen.getByText("blogs")).toBeVisible();
  });
});
