import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreatePost from "../../src/containers/CreatePost";
import { getUserInfo } from "../../src/features/helpers";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

// https://github.com/jsdom/jsdom/issues/3002
Range.prototype.getBoundingClientRect = vi.fn();
Range.prototype.getClientRects = () => ({
  item: vi.fn(),
  length: 0,
  [Symbol.iterator]: vi.fn(),
});

describe("Create Post", () => {
  beforeEach(() => {
    const client = new QueryClient();
    const routes = [
      {
        path: "/",
        element: (
          <QueryClientProvider client={client}>
            <CreatePost />
          </QueryClientProvider>
        ),
        id: "root",
        loader: () => getUserInfo(),
      },
      {
        path: "/post/oscar/blogpost",
        element: <p>Success!</p>,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);
  });
  it("renders correctly", async () => {
    await waitFor(() => screen.getByRole("form"));
    expect(screen.getByRole("form")).toBeVisible();
  });
  it("saves correctly", async () => {
    await waitFor(() => screen.getByRole("form"));
    const titleInput = screen.getByLabelText("Title");
    const submitButton = screen.getByTestId("submit-button");
    await userEvent.type(titleInput, "blogpost");
    await userEvent.click(submitButton);
    await waitFor(() => screen.getByRole("paragraph"));
    expect(screen.getByRole("paragraph")).toBeVisible();
    // user "name" is oscar
  });
});
