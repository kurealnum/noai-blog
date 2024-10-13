import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Notifications from "../../src/containers/Notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

describe("Notifications", () => {
  it("renders correctly", async () => {
    const queryClient = new QueryClient();
    render(
      <BrowserRouter>
        {" "}
        <QueryClientProvider client={queryClient}>
          <Notifications />
        </QueryClientProvider>
      </BrowserRouter>,
    );
    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    expect(screen.getByRole("list")).toBeVisible();
  });
});
