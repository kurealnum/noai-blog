import { expect, afterEach, afterAll, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";

expect.extend(matchers);

const posts = [
  {
    user: { username: "oscar" },
    title: "My Awesome Blog Post",
    content: "Here's some writing.",
    created_date: "2024-09-09T18:35:01.757930Z",
    updated_date: "2024-09-09T18:35:01.757938Z",
  },
];

const comments = [
  {
    id: 1,
    content: "A comment.",
    created_date: "2024-09-15T12:51:52.716908Z",
    updated_date: "2024-09-15T12:51:52.716917Z",
    user: 1,
    post: 1,
  },
];

const manageLinks = [{ id: 7, link: "google.com", name: "Google!", user: 1 }];
const userInfo = {
  username: "oscar",
  email: "admin@gmail.com",
  first_name: "first",
  last_name: "last",
  about_me: "Something about me",
  date_joined: "2024-09-09T16:35:58Z",
  technical_info: "Techy info",
  profile_picture: "/media/profile_pictures/2024-08-26_13-44.png",
};
const loginSuccess = true;
const logoutSuccess = true;
const registerSuccess = true;
const blogPost = {
  user: {
    username: "oscar",
    profile_picture: "/media/profile_pictures/pfp.png",
  },
  title: "Why Django is so amazing!",
  content: "Hello world! This is my blog post.",
  created_date: "2024-09-09T18:35:07.417021Z",
  updated_date: "2024-09-17T16:52:43.289900Z",
  likes: 0,
};

// I use "oscar" as the username field for almost everything
// also, there are a lot of "duplicate" urls, such as:
// /api/accounts/manage-links/oscar/
// and
// /api/accounts/manage-links/
// this is because a lot of the views on the backend have paths for requests with *and* without the username
export const restHandlers = [
  http.get("/api/blog-posts/get-post/oscar/why-django-is-so-amazing/", () => {
    return HttpResponse.json(blogPost);
  }),
  http.post("/api/accounts/register/", () => {
    return HttpResponse.json(registerSuccess);
  }),
  http.get("/api/blog-posts/get-posts/oscar/", () => {
    return HttpResponse.json(posts);
  }),
  http.get("/api/blog-posts/get-posts/", () => {
    return HttpResponse.json(posts);
  }),
  http.get("/api/blog-posts/get-comments/", () => {
    return HttpResponse.json(comments);
  }),
  http.get("/api/accounts/manage-links/oscar/", () => {
    return HttpResponse.json(manageLinks);
  }),
  http.get("/api/accounts/manage-links/", () => {
    return HttpResponse.json(manageLinks);
  }),
  http.get("/api/accounts/user-info/oscar/", () => {
    return HttpResponse.json(userInfo);
  }),
  http.get("/api/accounts/user-info/", () => {
    return HttpResponse.json(userInfo);
  }),
  http.post("/api/accounts/login/", () => {
    return HttpResponse.json(loginSuccess);
  }),
  http.post("/api/accounts/logout/", () => {
    return HttpResponse.json(logoutSuccess);
  }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

afterAll(() => server.close());

afterEach(() => {
  cleanup();
  server.resetHandlers();
});
