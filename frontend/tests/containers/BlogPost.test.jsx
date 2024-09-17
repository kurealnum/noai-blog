import { render, waitForElementToBeRemoved } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import BlogPost from "../../src/containers/BlogPost";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

describe("Blog Post", () => {
  it("renders correctly", async () => {
    const rendered = render(
      <Router initialEntries={["/post/oscar/why-django-is-so-amazing"]}>
        <Routes>
          <Route path="/post/:username/:slug" element={<BlogPost />} />
        </Routes>
      </Router>,
    );

    await waitForElementToBeRemoved(() => rendered.getByTestId("loader"));

    expect(rendered.getByRole("heading")).toBeVisible();
    expect(rendered.getByRole("img")).toBeVisible();
  });
});
