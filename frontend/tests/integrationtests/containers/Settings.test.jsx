import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Settings from "../../../src/containers/Settings";
import { getUserInfo } from "../../../src/features/helpers";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

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
    const rendered = render(<RouterProvider router={router} />);

    await waitFor(() => rendered.baseElement.childNodes[0].hasChildNodes());
    expect(rendered.getByRole("form")).toBeVisible();
  });
});
