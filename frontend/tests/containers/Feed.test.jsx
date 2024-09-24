import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Feed from "../../src/containers/Feed";
import userEvent from "@testing-library/user-event";

describe("Feed", () => {
  it("renders correctly", async () => {
    render(<Feed />);
    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    expect(screen.getByRole("form")).toBeVisible();
  });
  it("paginates correctly", async () => {
    render(<Feed />);

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    const input = screen.getByLabelText("Page Number");
    await userEvent.clear(input);
    await userEvent.type(input, "2");
    const button = screen.getByRole("button");
    await userEvent.click(button);

    await waitFor(() => screen.getByRole("heading"));
    expect(screen.getByRole("heading")).toHaveTextContent(
      "There were no posts to be shown!",
    );
  });
});
