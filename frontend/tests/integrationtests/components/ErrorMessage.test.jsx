import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorMessage from "../../../src/components/ErrorMessage";
import { expect, test } from "vitest";

test("does error render with isError = false", () => {
  const rendered = render(
    <ErrorMessage
      isError={false}
      message="Error message"
      altMessage="No error message"
    />,
  );
  expect(rendered.getByRole("paragraph")).toHaveTextContent("No error message");
});
