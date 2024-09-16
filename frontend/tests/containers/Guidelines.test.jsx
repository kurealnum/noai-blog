import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Guidelines from "../../../src/containers/Guidelines";

describe("Guidelines", () => {
  it("renders correctly", () => {
    const rendered = render(<Guidelines />);
    expect(rendered.getByRole("paragraph")).toBeEmptyDOMElement();
  });
});
