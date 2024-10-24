import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Homepage from "../../src/containers/Homepage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { getUserInfo } from "../../src/features/helpers";
import server from "../setup";
import { HttpResponse, http } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Homepage", () => {
  beforeEach(() => {
    const userInfo = {
      username: "notoscar",
      email: "admin@gmail.com",
      first_name: "first",
      last_name: "last",
      about_me: "Something about me",
      date_joined: "2024-09-09T16:35:58Z",
      technical_info: "Techy info",
      profile_picture: "/media/profile_pictures/2024-08-26_13-44.png",
    };
    server.use(
      http.get("/api/accounts/user-info/", () => HttpResponse.json(userInfo)),
    );
    const queryClient = new QueryClient();
    const routes = [
      {
        path: "/homepage/:username",
        element: (
          <QueryClientProvider client={queryClient}>
            <Homepage />
          </QueryClientProvider>
        ),
        id: "root",
        loader: () => getUserInfo(),
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/homepage/oscar"],
      initialIndex: 0,
    });
    render(<RouterProvider router={router} />);
  });

  it("renders correctly", async () => {
    await waitFor(() => screen.getByText("oscar"));

    expect(screen.getByText("oscar")).toBeDefined();
    expect(screen.getAllByRole("heading")).toHaveLength(4);
  });
  it("follows correctly and unfollow correctly", async () => {
    await waitFor(() => screen.getByText("oscar"));

    const followButton = screen.getByText("Follow");
    await userEvent.click(followButton);

    await waitFor(() => screen.getByTestId("success-alert"));
    const unfollowButton = screen.getByText("Unfollow");
    await userEvent.click(unfollowButton);

    await waitFor(() => screen.getByTestId("success-alert"));
    expect(screen.getByText("Follow")).toBeVisible();
  });
});
