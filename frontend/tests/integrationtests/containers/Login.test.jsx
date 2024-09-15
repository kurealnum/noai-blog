import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Login from "../../../src/containers/Login";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

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
});
