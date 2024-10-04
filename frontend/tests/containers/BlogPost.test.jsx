import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it } from "vitest";
import BlogPost from "../../src/containers/BlogPost";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Blog Post", () => {
  beforeEach(async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Router initialEntries={["/post/oscar/why-django-is-so-amazing"]}>
          <Routes>
            <Route path="/post/:username/:slug" element={<BlogPost />} />
          </Routes>
        </Router>
      </QueryClientProvider>,
    );
    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
  });
  it("renders correctly", async () => {
    expect(screen.getByRole("heading")).toBeVisible();
    expect(screen.getByText("By oscar")).toBeVisible();
  });
});
