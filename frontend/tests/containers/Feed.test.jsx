import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Feed from "../../src/containers/Feed";

describe("Feed", () => {
  it("renders correctly", () => {
    render(<Feed />);
    expect(screen.getByRole("paragraph")).toHaveTextContent(
      "This is your feed!",
    );
  });
});
