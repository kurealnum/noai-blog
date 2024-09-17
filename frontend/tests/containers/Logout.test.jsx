import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Login from "../../src/containers/Login";
import Logout from "../../src/containers/Logout";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

describe("Logout", () => {
  it("renders correctly", async () => {
    // logout is a tricky one, as it should really just redirect almost instantly
    const rendered = render(
      <Router initialEntries={["/logout"]}>
        <Routes>
          <Route path="/logout" element={<Logout />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>,
    );

    await waitForElementToBeRemoved(screen.getByRole("paragraph"));
    expect(rendered.getByRole("form")).toBeVisible();
  });
});
