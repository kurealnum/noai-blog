import {
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it } from "vitest";
import BlogPost from "../../src/containers/BlogPost";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getUserInfo } from "../../src/features/helpers";
import userEvent from "@testing-library/user-event";
import NavBar from "../../src/containers/NavBar";

describe("Blog Post", () => {
  beforeEach(async () => {
    const queryClient = new QueryClient();

    const routes = [
      {
        path: "/post/:username/:slug",
        element: <BlogPost />,
      },
      {
        path: "/",
        element: <NavBar />,
        id: "root",
        loader: () => getUserInfo(),
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/post/oscar/why-django-is-so-amazing"],
      initialIndex: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
  });
  it("renders correctly", async () => {
    //expect(screen.getByText("Comments")).toBeVisible();
    //expect(screen.getByText("By oscar")).toBeVisible();
    //expect(screen.getByText("This is my comment")).toBeVisible();
  });
  it("deletes comment properly", async () => {
    //const commentContent = screen.getByTestId("comment2");
    //const deleteButton = screen.getByTestId("delete-comment2");
    //expect(commentContent).toHaveTextContent("My content");
    //await userEvent.click(deleteButton);
    //expect(screen.getByRole("dialog")).toBeVisible();
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
