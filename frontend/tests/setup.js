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

// I use "oscar" as the username field for almost everything
export const restHandlers = [
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
  http.get("/api/accounts/user-info/oscar/", () => {
    return HttpResponse.json(userInfo);
  }),
  http.get("/api/accounts/login/", () => {
    return HttpResponse.json(loginSuccess);
  }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

afterAll(() => server.close());

afterEach(() => {
  cleanup();
  server.resetHandlers();
});
