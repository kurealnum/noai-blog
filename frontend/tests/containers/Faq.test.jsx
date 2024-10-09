import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Faq from "../../src/containers/Faq";

describe("Faq", () => {
  it("renders correctly", () => {
    render(<Faq />);
    expect(screen.getByText("FAQ")).toBeVisible();
  });
});
