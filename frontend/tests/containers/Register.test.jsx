import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Register from "../../src/containers/Register";

describe("Register", () => {
  it("renders correctly", () => {
    const rendered = render(<Register />);

    expect(rendered.getByRole("paragraph")).toBeVisible();
  });
});
