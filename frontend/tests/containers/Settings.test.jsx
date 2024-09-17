import {
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Settings from "../../src/containers/Settings";
import { getUserInfo } from "../../src/features/helpers";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Settings", () => {
  it("renders correctly", async () => {
    // using createMemoryRouter because <MemoryRouter> doesnt support loaders
    const routes = [
      {
        path: "/",
        id: "root",
        element: <Settings />,
        loader: () => getUserInfo(),
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);

    const form = await screen.findByRole("form");
    expect(form).toBeVisible();
  });
  it("dialog/modal opens on click", async () => {
    const routes = [
      {
        path: "/",
        id: "root",
        element: <Settings />,
        loader: () => getUserInfo(),
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);

    const button = await screen.findByText("Add link");
    await userEvent.click(button);
    const dialogLabel = screen.getByLabelText("Name");
    expect(dialogLabel).toBeVisible();
  });
});
