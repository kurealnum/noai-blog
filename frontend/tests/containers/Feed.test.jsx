import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Feed from "../../src/containers/Feed";

describe("Feed", () => {
  it("renders correctly", () => {
    const rendered = render(<Feed />);
    expect(rendered.getByRole("paragraph")).toHaveTextContent(
      "This is your feed!",
    );
  });
});
