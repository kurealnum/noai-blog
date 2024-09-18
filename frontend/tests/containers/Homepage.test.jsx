import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Homepage from "../../src/containers/Homepage";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

describe("Homepage", () => {
  it("renders correctly", async () => {
    render(
      <Router initialEntries={["/homepage/oscar"]}>
        <Routes>
          <Route path="/homepage/:username" element={<Homepage />} />
        </Routes>
      </Router>,
    );

    await waitForElementToBeRemoved(
      screen.getByText("The user oscar does not exist!"),
    );

    expect(screen.getByText("oscar")).toBeDefined();
    expect(screen.getAllByRole("heading")).toHaveLength(4);
  });
});
