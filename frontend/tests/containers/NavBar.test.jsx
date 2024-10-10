import { render, screen, waitFor } from "@testing-library/react";
import NavBar from "../../src/containers/NavBar";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { getUserInfo } from "../../src/features/helpers";
import userEvent from "@testing-library/user-event";

describe("NavBar", () => {
  it("renders correctly & dropdown menu opens", async () => {
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

    const button = screen.getByTestId("open-dropdown");
    await userEvent.click(button);
    await waitFor(() => screen.getByText("Dashboard"));
    expect(screen.getByText("Dashboard")).toBeVisible();
  });
});
