import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import Login from "../../src/containers/Login";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Dashboard } from "@mui/icons-material";

const mockUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const reactRouter = await vi.importActual("react-router-dom");
  return { ...reactRouter, useNavigate: () => mockUseNavigate };
});

describe("Login", () => {
  it("renders correctly", () => {
    render(
      <Router initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>,
    );

    expect(screen.getByRole("form")).toBeTruthy();
  });
  it("logins in and navigates correctly", async () => {
    const user = userEvent.setup();
    render(
      <Router initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>,
    );

    const button = screen.getByRole("button");
    const username = screen.getByLabelText("Username");
    const password = screen.getByLabelText("Password");

    await user.type(username, "MyUsername");
    await user.type(password, "SecurePassword123");
    await user.click(button);

    await waitFor(() => expect(mockUseNavigate).toHaveBeenCalled());
  });
});
