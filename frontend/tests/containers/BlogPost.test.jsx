import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import BlogPost from "../../src/containers/BlogPost";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

describe("Blog Post", () => {
  it("renders correctly", async () => {
    render(
      <Router initialEntries={["/post/oscar/why-django-is-so-amazing"]}>
        <Routes>
          <Route path="/post/:username/:slug" element={<BlogPost />} />
        </Routes>
      </Router>,
    );

    await waitForElementToBeRemoved(() => screen.getByTestId("loader"));

    expect(screen.getByRole("heading")).toBeVisible();
    expect(screen.getByRole("img")).toBeVisible();
    expect(screen.getByText("By oscar")).toBeVisible();
  });
});
