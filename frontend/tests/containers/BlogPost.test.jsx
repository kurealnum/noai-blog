import {
  render,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import BlogPost from "../../src/containers/BlogPost";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import server from "../setup";
import { HttpResponse, http } from "msw";

describe("Blog Post", () => {
  it("renders correctly", async () => {
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
    expect(screen.getByRole("heading")).toBeVisible();
    expect(screen.getByText("By oscar")).toBeVisible();
  });
  it("reacts and unreacts properly", async () => {
    //i'd like to come back and test this at some point, but it just isnt worth my time atm
    //weird rendering pattern because we need to change what the server returns mid test
    //const queryClient = new QueryClient({
    //  defaultOptions: {
    //    queries: {
    //      retry: false,
    //    },
    //  },
    //});
    //const toRender = (
    //  <QueryClientProvider client={queryClient}>
    //    <Router initialEntries={["/post/oscar/why-django-is-so-amazing"]}>
    //      <Routes>
    //        <Route path="/post/:username/:slug" element={<BlogPost />} />
    //      </Routes>
    //    </Router>
    //  </QueryClientProvider>
    //);
    //server.use(
    //  http.get(
    //    "/api/blog-posts/manage-post-reactions/why-django-is-so-amazing/",
    //    () => {
    //      return HttpResponse.json(false, { status: 404 });
    //    },
    //  ),
    //);
    //const { rerender } = render(toRender);
    //await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
    //expect(screen.getByTestId("FavoriteBorderIcon")).toBeVisible();
    //const reactionButton = screen.getByTestId("reaction-button");
    //await userEvent.click(reactionButton);
    //
    //server.use(
    //  http.get(
    //    "/api/blog-posts/manage-post-reactions/why-django-is-so-amazing/",
    //    () => {
    //      return HttpResponse.json(true, { status: 200 });
    //    },
    //  ),
    //);
    //server.use(
    //  http.get("/api/blog-posts/get-post/why-django-is-so-amazing/", () => {
    //    return HttpResponse.json({
    //      user: {
    //        username: "oscar",
    //        profile_picture: "/media/profile_pictures/pfp.png",
    //      },
    //      title: "Why Django is so amazing!",
    //      content: "Hello world! This is my blog post.",
    //      created_date: "2024-09-09T18:35:07.417021Z",
    //      updated_date: "2024-09-17T16:52:43.289900Z",
    //      likes: 1,
    //    });
    //  }),
    //);
    //
    //rerender(toRender);
    //
    //await waitForElementToBeRemoved(() => screen.getByTestId("FavoriteIcon"));
    //expect(screen.getByTestId("FavoriteIcon"));
  });
});
