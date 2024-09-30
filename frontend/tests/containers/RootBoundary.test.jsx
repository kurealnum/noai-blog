import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import RootBoundary from "../../src/containers/RootBoundary";
import { RouterProvider } from "react-router-dom";
import { createMemoryRouter } from "react-router-dom";
import NavBar from "../../src/containers/NavBar";
import Feed from "../../src/containers/Feed";

describe("Root Boundary", () => {
  it("redirects to error page", async () => {
    const routes = [
      {
        path: "/",
        errorElement: <RootBoundary />,
        element: <NavBar />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/idontwork"],
    });
    render(<RouterProvider router={router} />);

    await waitFor(() => screen.getByRole("heading"));

    expect(screen.getAllByRole("paragraph")).toHaveLength(2);
    expect(screen.getByRole("heading")).toHaveTextContent("HTTP 404");
  });
  it("does not redirect to error page when URL is correct", async () => {
    const queryClient = new QueryClient();
    const routes = [
      {
        path: "/",
        errorElement: <RootBoundary />,
        element: <NavBar />,
        children: [
          {
            path: "/feed",
            element: (
              <QueryClientProvider client={queryClient}>
                <Feed />
              </QueryClientProvider>
            ),
          },
        ],
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/feed"],
    });
    render(<RouterProvider router={router} />);

    await waitFor(() => screen.getByRole("form"));

    expect(screen.getByRole("form")).toBeVisible();
  });
});
