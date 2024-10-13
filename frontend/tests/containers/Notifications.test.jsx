import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Notifications from "../../src/containers/Notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import NavBar from "../../src/containers/NavBar";
import { getUserInfo } from "../../src/features/helpers";

describe("Notifications", () => {
  it("renders correctly", async () => {
    const queryClient = new QueryClient();
    const routes = [
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/",
        element: <NavBar />,
        id: "root",
        loader: () => getUserInfo(),
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/notifications"],
      initialIndex: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    expect(screen.getByRole("list")).toBeVisible();
  });
});
