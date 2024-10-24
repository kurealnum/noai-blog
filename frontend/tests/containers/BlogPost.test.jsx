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
import server from "../setup";
import { HttpResponse, http } from "msw";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

describe("Blog Post", () => {
  beforeEach(async () => {
    server.use(
      http.get(
        "/api/blog-posts/get-comments/oscar/why-django-is-so-amazing/",
        () => {
          return HttpResponse.json([
            {
              user: {
                username: "oscar",
                profile_picture: "/media/profile_pictures/IMG_1801.jpg",
                approved_ai_usage: true,
              },
              reply_to: null,
              content: "edited!!!",
              created_date: "2024-10-17T17:35:23.318694Z",
              updated_date: "2024-10-22T01:09:34.453660Z",
              id: 16,
              flagged: false,
            },
          ]);
        },
      ),
    );
    const queryClient = new QueryClient();
    const routes = [
      {
        path: "/:username/:slug",
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
      initialEntries: ["/oscar/why-django-is-so-amazing"],
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
    expect(screen.getByText("Comments")).toBeVisible();
    expect(screen.getByText("edited!!!")).toBeVisible();
  });
  it("deletes comment properly", async () => {
    //const commentContent = screen.getByTestId("comment2");
    //const deleteButton = screen.getByTestId("delete-comment2");
    //expect(commentContent).toHaveTextContent("My content");
    //await userEvent.click(deleteButton);
    //expect(screen.getByRole("dialog")).toBeVisible();
  });
  //it("reacts and unreacts properly", async () => {
  //  server.use(
  //    http.get(
  //      "/api/blog-posts/manage-post-reactions/why-django-is-so-amazing/",
  //      () => {
  //        return HttpResponse.json(false, { status: 404 });
  //      },
  //    ),
  //  );
  //  expect(screen.getByTestId("FavoriteIcon")).toBeVisible();
  //  expect(screen.getByTestId("reaction-count")).toHaveTextContent("0");
  //  const reactionButton = screen.getByTestId("reaction-button-icon");
  //  await userEvent.click(reactionButton);
  //
  //  server.use(
  //    http.get(
  //      "/api/blog-posts/manage-post-reactions/why-django-is-so-amazing/",
  //      () => {
  //        return HttpResponse.json(true, { status: 200 });
  //      },
  //    ),
  //  );
  //  server.use(
  //    http.get("/api/blog-posts/get-post/why-django-is-so-amazing/", () => {
  //      return HttpResponse.json({
  //        user: {
  //          username: "oscar",
  //          profile_picture: "/media/profile_pictures/pfp.png",
  //        },
  //        title: "Why Django is so amazing!",
  //        content: "Hello world! This is my blog post.",
  //        created_date: "2024-09-09T18:35:07.417021Z",
  //        updated_date: "2024-09-17T16:52:43.289900Z",
  //        likes: 1,
  //      });
  //    }),
  //  );
  //  await waitFor(() => screen.getByTestId("reaction-count").value == 1);
  //  expect(screen.getByTestId("FavoriteIcon"));
  //});
});
