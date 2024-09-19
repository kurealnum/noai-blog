import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Settings from "../../src/containers/Settings";
import { getUserInfo } from "../../src/features/helpers";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../../src/containers/Login";

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
  it("form submits correctly", async () => {
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

    await screen.findByRole("form");

    // setting this for the `changeSettings()` function
    document.cookie = "user_id=1";

    const username = screen.getByLabelText("Username");
    const email = screen.getByLabelText("Email");
    const firstName = screen.getByLabelText("First name");
    const lastName = screen.getByLabelText("Last name");
    const aboutMe = screen.getByLabelText("About me");
    const technicalInfo = screen.getByLabelText("Technical Info");

    await userEvent.type(username, "Bobby");
    await userEvent.type(email, "myemail@gmail.com");
    await userEvent.type(firstName, "Bobby");
    await userEvent.type(lastName, "Joe");
    await userEvent.type(aboutMe, "All about me");
    await userEvent.type(technicalInfo, "Javascript");

    const button = screen.getByTestId("form-save");
    await userEvent.click(button);

    expect(screen.getByTestId("saved-alert")).toBeVisible();
  });
});
