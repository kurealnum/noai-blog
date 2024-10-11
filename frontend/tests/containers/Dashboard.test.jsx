import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Dashboard from "../../src/containers/Dashboard";
import { BrowserRouter } from "react-router-dom";

describe("Dashboard", () => {
  it("renders correctly", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );
    expect(screen.getByText("Your comments")).toBeTruthy();
    expect(screen.getByText("Your posts")).toBeTruthy();
  });
  it("comments and posts render correctly", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );
    await waitForElementToBeRemoved(() => screen.getAllByRole("progressbar"));

    const lists = screen.getAllByRole("list");
    const listItems = screen.getAllByRole("listitem");
    const headers = screen.getAllByRole("heading");
    expect(lists).toHaveLength(2);
    expect(listItems).toHaveLength(2);

    //length 3 because of the one blog post that is rendered
    expect(headers).toHaveLength(3);
  });
});
