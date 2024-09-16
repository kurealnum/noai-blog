import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import Login from "../../../src/containers/Login";
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Dashboard } from "@mui/icons-material";

vi.mock("react-router-dom", async () => {
  const reactRouter = await vi.importActual("react-router-dom");
  return { ...reactRouter };
});

describe("Login", () => {
  it("renders correctly", () => {
    const rendered = render(
      <Router initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>,
    );

    expect(rendered.getByRole("form")).toBeTruthy();
  });
  it("logins in and navigates correctly", async () => {
    const user = userEvent.setup();
    const rendered = render(
      <Router initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>,
    );

    const form = rendered.getByRole("form");
    const username = rendered.getByLabelText("Username");
    const password = rendered.getByLabelText("Password");

    await user.type(username, "MyUsername");
    await user.type(password, "SecurePassword123");
    await user.click(form);

    expect(useNavigate).toHaveBeenCalled();
  });
});
