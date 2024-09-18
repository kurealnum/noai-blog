import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Register from "../../src/containers/Register";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../../src/containers/Login";

describe("Register", () => {
  it("renders correctly", () => {
    render(
      <Router initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element=<Register /> />
        </Routes>
      </Router>,
    );

    expect(screen.getByRole("form")).toBeVisible();
  });
  it("form submits correctly", async () => {
    render(
      <Router initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element=<Register /> />
          <Route path="/login" element=<Login /> />
        </Routes>
      </Router>,
    );

    const username = screen.getByLabelText("Username");
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const firstName = screen.getByLabelText("First name");
    const lastName = screen.getByLabelText("Last name");
    const aboutMe = screen.getByLabelText("About me");
    const technicalInfo = screen.getByLabelText("Technical Info");

    await userEvent.type(username, "Bobby");
    await userEvent.type(email, "myemail@gmail.com");
    await userEvent.type(password, "mypassword123");
    await userEvent.type(firstName, "Bobby");
    await userEvent.type(lastName, "Joe");
    await userEvent.type(aboutMe, "All about me");
    await userEvent.type(technicalInfo, "Javascript");

    const button = screen.getByRole("button");
    const header = screen.getByTestId("register");
    await userEvent.click(button);

    expect(header).not.toBeInTheDocument();
  });
});
