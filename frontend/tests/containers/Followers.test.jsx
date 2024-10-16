import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Followers from "../../src/containers/Followers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

describe("Followers", async () => {
  it("renders correctly", async () => {
    const queryClient = new QueryClient();
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Followers />
        </QueryClientProvider>
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByRole("list"));
    const list = screen.getByRole("list");
    expect(list).toBeVisible();
  });
});
