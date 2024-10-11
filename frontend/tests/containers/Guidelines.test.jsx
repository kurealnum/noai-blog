import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Guidelines from "../../src/containers/Guidelines";
import { BrowserRouter } from "react-router-dom";

describe("Guidelines", () => {
  it("renders correctly", () => {
    render(
      <BrowserRouter>
        <Guidelines />
      </BrowserRouter>,
    );
    expect(screen.getByText("Guidelines")).toBeVisible();
  });
});
