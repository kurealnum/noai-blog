//import { render, waitForElementToBeRemoved } from "@testing-library/react";
//import "@testing-library/jest-dom";
//import { describe, expect, it, vi } from "vitest";
//import AuthenticatedRoute from "../../../src/routes/AuthenticatedRoutes";
//import { getUserInfo } from "../../../src/features/helpers";
//import { RouterProvider, createMemoryRouter } from "react-router-dom";

// TODO
//describe("Authenticated Route", () => {
//  it("navigates to login if not logged in", async () => {
//    const mockCheckIfAuthenticatedTrue = vi.fn(() => true);
//    vi.mock("../features/auth", async () => {
//      const auth = await vi.importActual("../features/auth");
//      return {
//        ...auth,
//        checkAuthenticatedOnServer: () => mockCheckIfAuthenticatedTrue,
//      };
//    });
//    // using createMemoryRouter because <MemoryRouter> doesnt support loaders
//    const routes = [
//      {
//        path: "/",
//        id: "root",
//        element: <AuthenticatedRoute children={<p>Logged in</p>} />,
//        loader: () => getUserInfo(),
//      },
//    ];
//    const router = createMemoryRouter(routes, {
//      initialEntries: ["/"],
//      initialIndex: 0,
//    });
//    const rendered = render(<RouterProvider router={router} />);
//
//    await waitForElementToBeRemoved(() => rendered.getByRole("paragraph"));
//    expect(mockCheckIfAuthenticatedTrue).toHaveBeenCalled();
//  });
//});

import { describe, it } from "vitest";

describe("Authenticated Route", () => {
  it.skip("See above (in code)");
});
