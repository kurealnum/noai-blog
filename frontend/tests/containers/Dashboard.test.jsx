import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Dashboard from "../../../src/containers/Dashboard";

describe("Dashboard", () => {
  it("renders correctly", () => {
    const rendered = render(<Dashboard />);
    expect(rendered.getByText("Your comments")).toBeTruthy();
    expect(rendered.getByText("Your posts")).toBeTruthy();
  });
  it("comments and posts render correctly", async () => {
    const rendered = render(<Dashboard />);

    await waitForElementToBeRemoved(() => screen.getAllByRole("progressbar"));

    const lists = rendered.getAllByRole("list");
    const listItems = rendered.getAllByRole("listitem");

    expect(lists).toHaveLength(2);
    expect(listItems).toHaveLength(2);
  });
});
