import { render, screen, waitFor } from "@testing-library/react";
import NavBar from "../../src/containers/NavBar";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { getUserInfo } from "../../src/features/helpers";
import userEvent from "@testing-library/user-event";

describe("NavBar", () => {
  it("renders correctly with window width < 800", async () => {
    // using createMemoryRouter because <MemoryRouter> doesnt support loaders
    const routes = [
      {
        path: "/",
        element: <NavBar />,
        loader: () => getUserInfo(),
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);

    window.innerWidth = 400;

    await waitFor(() => screen.getByRole("img"));
    const img = screen.getByRole("img");
    expect(img).toBeVisible();
  });

  it("renders correctly with window width > 800", async () => {
    // using createMemoryRouter because <MemoryRouter> doesnt support loaders
    const routes = [
      {
        path: "/",
        element: <NavBar />,
        loader: () => getUserInfo(),
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);

    window.innerWidth = 1200;

    await waitFor(() => screen.getByText("oscar"));
    const usernameBox = screen.getByText("oscar");
    expect(usernameBox).toBeVisible();
  });
  it("dialog opens and closes correctly for mobile navbar", async () => {
    // using createMemoryRouter because <MemoryRouter> doesnt support loaders
    const routes = [
      {
        path: "/",
        element: <NavBar />,
        loader: () => getUserInfo(),
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);

    window.innerWidth = 400;
    await waitFor(() => screen.getByRole("img"));

    // opening the dialog
    const openButton = screen.getByTestId("menu-open");
    await userEvent.click(openButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // closing the dialog
    const closeButton = screen.getByTestId("CloseIcon");
    await userEvent.click(closeButton);
    expect(screen.getByRole("dialog")).not.toBeVisible();
  });
});
