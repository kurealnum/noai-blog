import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Feed from "../../src/containers/Feed";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Feed", () => {
  beforeEach(async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Feed />
      </QueryClientProvider>,
    );
    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
  });
  it("renders correctly", async () => {
    expect(screen.getByRole("form")).toBeVisible();
  });
  it("paginates correctly", async () => {
    const input = screen.getByLabelText("Page Number");
    await userEvent.clear(input);
    await userEvent.type(input, "2");
    const button = screen.getByRole("button");
    await userEvent.click(button);

    await waitFor(() => screen.getAllByRole("heading"));
    const headers = screen.getAllByRole("heading");
    expect(headers[0]).toHaveTextContent("Why Django is so amazing!");
    expect(headers[1]).toHaveTextContent("Why Django is so amazing!");
  });
});
