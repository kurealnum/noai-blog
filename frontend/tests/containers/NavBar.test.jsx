import { render, screen, waitFor } from "@testing-library/react";
import NavBar from "../../src/containers/NavBar";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { getUserInfo } from "../../src/features/helpers";

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
    const rendered = render(<RouterProvider router={router} />);

    window.innerWidth = 400;

    await waitFor(() => rendered.baseElement.childNodes[0].hasChildNodes());
    const img = rendered.getByRole("img");
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
    const rendered = render(<RouterProvider router={router} />);

    window.innerWidth = 1200;

    await waitFor(() => rendered.baseElement.childNodes[0].hasChildNodes());
    const img = rendered.getByRole("img");
    expect(img).toBeVisible();
  });
});
