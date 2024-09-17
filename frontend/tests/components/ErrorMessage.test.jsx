import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorMessage from "../../src/components/ErrorMessage";
import { describe, expect, it } from "vitest";

describe("ErrorMessage", () => {
  it("does altmessage render with isError = false", () => {
    const rendered = render(
      <ErrorMessage
        isError={false}
        message="Error message"
        altMessage="No error message"
      />,
    );
    expect(rendered.getByRole("paragraph")).toHaveTextContent(
      "No error message",
    );
  });
  it("does message render with isError = true", () => {
    const rendered = render(
      <ErrorMessage
        isError={true}
        message="Error message"
        altMessage="No error message"
      />,
    );
    expect(rendered.getByRole("paragraph")).toHaveTextContent("Error message");
  });
  it("does component function when altmessage is null", () => {
    const rendered = render(
      <ErrorMessage isError={false} message="Error message" />,
    );
    expect(rendered.queryByRole("paragraph")).toBeNull();
  });
});
