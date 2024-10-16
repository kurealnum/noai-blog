import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Following from "../../src/containers/Following";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

describe("Following", async () => {
  it("renders correctly", async () => {
    const queryClient = new QueryClient();
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Following />
        </QueryClientProvider>
      </BrowserRouter>,
    );
    await waitFor(() => screen.getByRole("list"));
    const list = screen.getByRole("list");
    expect(list).toBeVisible(1);
  });
});
