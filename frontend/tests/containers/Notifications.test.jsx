import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Notifications from "../../src/containers/Notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Notifications", () => {
  it("renders correctly", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Notifications />
      </QueryClientProvider>,
    );
    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    expect(screen.getByRole("list")).toBeVisible();
  });
});
