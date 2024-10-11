import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditPost from "../../src/containers/EditPost";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getUserInfo } from "../../src/features/helpers";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// https://github.com/jsdom/jsdom/issues/3002
Range.prototype.getBoundingClientRect = vi.fn();
Range.prototype.getClientRects = () => ({
  item: vi.fn(),
  length: 0,
  [Symbol.iterator]: vi.fn(),
});

describe("Edit Post", () => {
  beforeEach(() => {
    const client = new QueryClient();
    const routes = [
      {
        path: "/edit-post/:slug",
        element: (
          <QueryClientProvider client={client}>
            <EditPost />
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
      initialEntries: ["/edit-post/why-django-is-so-amazing"],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);
  });
  it("updates correctly", async () => {
    await waitFor(() => screen.getByRole("form"));
    const titleInput = screen.getByLabelText("Title");
    const submitButton = screen.getByTestId("submit-button");

    // no idea why I have to click on the titleinput before clearing it, but i do
    await userEvent.click(titleInput);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "blogpost");
    await userEvent.click(submitButton);
    await waitFor(() => screen.getByRole("paragraph"));
    expect(screen.getByRole("paragraph")).toBeVisible();
    // user "name" is oscar
  });
});
