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
    likes: 0,
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

const postComments = [
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    reply_to: {
      id: 1,
      content: "This is my comment",
      created_date: "2024-10-08T02:18:00.731271Z",
      updated_date: "2024-10-12T22:44:26.828929Z",
      is_read: true,
      user: 1,
      post: 9,
      reply_to: null,
    },
    content: "My content",
    created_date: "2024-10-12T00:44:27.442814Z",
    updated_date: "2024-10-12T23:00:32.682063Z",
    id: 2,
  },
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    reply_to: {
      id: 3,
      content: "My comment",
      created_date: "2024-10-12T15:36:33.834468Z",
      updated_date: "2024-10-12T22:44:26.832489Z",
      is_read: true,
      user: 1,
      post: 9,
      reply_to: null,
    },
    content: "A reply",
    created_date: "2024-10-12T15:37:03.011249Z",
    updated_date: "2024-10-12T23:00:32.684799Z",
    id: 4,
  },
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    reply_to: {
      id: 4,
      content: "A reply",
      created_date: "2024-10-12T15:37:03.011249Z",
      updated_date: "2024-10-12T23:00:32.684799Z",
      is_read: true,
      user: 1,
      post: 9,
      reply_to: 3,
    },
    content: "another reply",
    created_date: "2024-10-12T15:39:50.085721Z",
    updated_date: "2024-10-12T23:00:32.686355Z",
    id: 6,
  },
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    reply_to: {
      id: 6,
      content: "another reply",
      created_date: "2024-10-12T15:39:50.085721Z",
      updated_date: "2024-10-12T23:00:32.686355Z",
      is_read: true,
      user: 1,
      post: 9,
      reply_to: 4,
    },
    content: "more content",
    created_date: "2024-10-12T19:29:21.691204Z",
    updated_date: "2024-10-12T23:00:32.688687Z",
    id: 8,
  },
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    reply_to: null,
    content: "Some content",
    created_date: "2024-10-12T19:15:32.529706Z",
    updated_date: "2024-10-12T22:44:26.826209Z",
    id: 7,
  },
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    reply_to: null,
    content: "This is my comment",
    created_date: "2024-10-08T02:18:00.731271Z",
    updated_date: "2024-10-12T22:44:26.828929Z",
    id: 1,
  },
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    reply_to: null,
    content: "My comment",
    created_date: "2024-10-12T15:36:33.834468Z",
    updated_date: "2024-10-12T22:44:26.832489Z",
    id: 3,
  },
];

const manageCommentsResult = [
  {
    id: 2,
    content: "My content",
    created_date: "2024-10-12T00:44:27.442814Z",
    updated_date: "2024-10-12T23:00:32.682063Z",
    is_read: true,
    user: 1,
    post: 9,
    reply_to: 1,
  },
  {
    id: 4,
    content: "A reply",
    created_date: "2024-10-12T15:37:03.011249Z",
    updated_date: "2024-10-12T23:00:32.684799Z",
    is_read: true,
    user: 1,
    post: 9,
    reply_to: 3,
  },
  {
    id: 6,
    content: "another reply",
    created_date: "2024-10-12T15:39:50.085721Z",
    updated_date: "2024-10-12T23:00:32.686355Z",
    is_read: true,
    user: 1,
    post: 9,
    reply_to: 4,
  },
  {
    id: 8,
    content: "more content",
    created_date: "2024-10-12T19:29:21.691204Z",
    updated_date: "2024-10-12T23:00:32.688687Z",
    is_read: true,
    user: 1,
    post: 9,
    reply_to: 6,
  },
  {
    id: 7,
    content: "Some content",
    created_date: "2024-10-12T19:15:32.529706Z",
    updated_date: "2024-10-12T22:44:26.826209Z",
    is_read: true,
    user: 1,
    post: 9,
    reply_to: null,
  },
  {
    id: 1,
    content: "This is my comment",
    created_date: "2024-10-08T02:18:00.731271Z",
    updated_date: "2024-10-12T22:44:26.828929Z",
    is_read: true,
    user: 1,
    post: 9,
    reply_to: null,
  },
  {
    id: 3,
    content: "My comment",
    created_date: "2024-10-12T15:36:33.834468Z",
    updated_date: "2024-10-12T22:44:26.832489Z",
    is_read: true,
    user: 1,
    post: 9,
    reply_to: null,
  },
];

const manageFollowing = [
  {
    id: 2,
    user: {
      username: "deleted",
      profile_picture: null,
      approved_ai_usage: false,
    },
    follower: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/IMG_1794.jpg",
      approved_ai_usage: true,
    },
  },
];

const manageLinks = [
  { id: 7, link: "https://google.com", name: "MyLink", user: 1 },
];
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
const multipleBlogPosts = [
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/pfp.png",
    },
    title: "Why Django is so amazing!",
    content: "Hello world! This is my blog post.",
    created_date: "2024-09-09T18:35:07.417021Z",
    updated_date: "2024-09-17T16:52:43.289900Z",
    likes: 0,
  },
  {
    user: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/pfp.png",
    },
    title: "Why Django is so amazing!",
    content: "Hello world! This is my blog post.",
    created_date: "2024-09-09T18:35:07.417021Z",
    updated_date: "2024-09-17T16:52:43.289900Z",
    likes: 0,
  },
];

const comment = [
  {
    user: {
      username: "oscar",
      email: "admin@gmail.com",
      first_name: "oscar",
      last_name: "gaske",
      about_me: "Here's something about me.",
      date_joined: "2024-10-08T02:05:31Z",
      technical_info: "Python and DJango!",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    post: {
      user: {
        username: "oscar",
        email: "admin@gmail.com",
        first_name: "oscar",
        last_name: "gaske",
        about_me: "Here's something about me.",
        date_joined: "2024-10-08T02:05:31Z",
        technical_info: "Python and DJango!",
        profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
        approved_ai_usage: true,
      },
      slug_field: "my-new-title",
    },
    content: "My content",
    created_date: "2024-10-12T00:44:27.442814Z",
    updated_date: "2024-10-12T23:00:32.682063Z",
    is_read: true,
  },
  {
    user: {
      username: "oscar",
      email: "admin@gmail.com",
      first_name: "oscar",
      last_name: "gaske",
      about_me: "Here's something about me.",
      date_joined: "2024-10-08T02:05:31Z",
      technical_info: "Python and DJango!",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    post: {
      user: {
        username: "oscar",
        email: "admin@gmail.com",
        first_name: "oscar",
        last_name: "gaske",
        about_me: "Here's something about me.",
        date_joined: "2024-10-08T02:05:31Z",
        technical_info: "Python and DJango!",
        profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
        approved_ai_usage: true,
      },
      slug_field: "my-new-title",
    },
    content: "A reply",
    created_date: "2024-10-12T15:37:03.011249Z",
    updated_date: "2024-10-12T23:00:32.684799Z",
    is_read: true,
  },
  {
    user: {
      username: "oscar",
      email: "admin@gmail.com",
      first_name: "oscar",
      last_name: "gaske",
      about_me: "Here's something about me.",
      date_joined: "2024-10-08T02:05:31Z",
      technical_info: "Python and DJango!",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    post: {
      user: {
        username: "oscar",
        email: "admin@gmail.com",
        first_name: "oscar",
        last_name: "gaske",
        about_me: "Here's something about me.",
        date_joined: "2024-10-08T02:05:31Z",
        technical_info: "Python and DJango!",
        profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
        approved_ai_usage: true,
      },
      slug_field: "my-new-title",
    },
    content: "another reply",
    created_date: "2024-10-12T15:39:50.085721Z",
    updated_date: "2024-10-12T23:00:32.686355Z",
    is_read: true,
  },
  {
    user: {
      username: "oscar",
      email: "admin@gmail.com",
      first_name: "oscar",
      last_name: "gaske",
      about_me: "Here's something about me.",
      date_joined: "2024-10-08T02:05:31Z",
      technical_info: "Python and DJango!",
      profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
      approved_ai_usage: true,
    },
    post: {
      user: {
        username: "oscar",
        email: "admin@gmail.com",
        first_name: "oscar",
        last_name: "gaske",
        about_me: "Here's something about me.",
        date_joined: "2024-10-08T02:05:31Z",
        technical_info: "Python and DJango!",
        profile_picture: "/media/profile_pictures/Streaming_Thumbnail5.png",
        approved_ai_usage: true,
      },
      slug_field: "my-new-title",
    },
    content: "more content",
    created_date: "2024-10-12T19:29:21.691204Z",
    updated_date: "2024-10-12T23:00:32.688687Z",
    is_read: true,
  },
];

const manageFollowers = [
  {
    id: 2,
    user: {
      username: "deleted",
      profile_picture: null,
      approved_ai_usage: false,
    },
    follower: {
      username: "oscar",
      profile_picture: "/media/profile_pictures/IMG_1794.jpg",
      approved_ai_usage: true,
    },
  },
];

// successful fetch returns that dont need a body
const loginSuccess = true;
const logoutSuccess = true;
const registerSuccess = true;
const updateUserInfo = true;
const saveProfilePicture = true;
const manageLinksPut = true;
const createLink = true;
const multipleBlogPostsNone = null;
const createPostSuccess = true;
const profilePictureSuccess = true;
const linkDeleteSuccess = true;
const followSuccess = true;
const unfollowSuccess = true;
const isFollowingSelf = false;
const createReactionSuccess = true;
const managePostReactions = false;
const editPostSuccess = true;

// I use "oscar" as the username field for almost everything
// also, there are a lot of "duplicate" urls, such as:
// /api/accounts/manage-links/oscar/
// and
// /api/accounts/manage-links/
// this is because a lot of the views on the backend have paths for requests with *and* without the username
export const restHandlers = [
  http.get("/api/blog-posts/manage-following/", () => {
    return HttpResponse.json(manageFollowing);
  }),
  http.get("/api/blog-posts/manage-followers/", () => {
    return HttpResponse.json(manageFollowers);
  }),
  http.get("/api/blog-posts/manage-comments/", () => {
    return HttpResponse.json(manageCommentsResult);
  }),
  http.get("/api/blog-posts/get-comments/why-django-is-so-amazing/", () => {
    return HttpResponse.json(postComments);
  }),
  http.get(
    "/api/blog-posts/manage-post-reactions/why-django-is-so-amazing/",
    () => {
      return HttpResponse.json(managePostReactions);
    },
  ),
  http.put("/api/blog-posts/edit-post/", () => {
    return HttpResponse.json(editPostSuccess);
  }),
  http.get("/api/accounts/notifications/", () => {
    return HttpResponse.json(comment);
  }),
  http.delete("/api/accounts/manage-links/", () => {
    return HttpResponse.json(linkDeleteSuccess);
  }),
  http.get("/media/profile_pictures/2024-08-26_13-44.png", () => {
    return HttpResponse.json(profilePictureSuccess);
  }),
  http.get("/api/blog-posts/get-post/oscar/why-django-is-so-amazing/", () => {
    return HttpResponse.json(blogPost);
  }),
  http.post("/api/blog-posts/create-post/", () => {
    return HttpResponse.json(createPostSuccess);
  }),
  http.get("/api/blog-posts/feed/1/", () => {
    return HttpResponse.json(multipleBlogPosts);
  }),
  http.get("/api/blog-posts/feed/2/", () => {
    return HttpResponse.json(multipleBlogPostsNone);
  }),
  http.post("/api/accounts/manage-links/", () => {
    return HttpResponse.json(createLink);
  }),
  http.put("/api/accounts/update-user-info/1/", () => {
    return HttpResponse.json(updateUserInfo);
  }),
  http.patch("/api/accounts/save-profile-picture/", () => {
    return HttpResponse.json(saveProfilePicture);
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
  http.put("/api/accounts/manage-links/", () => {
    return HttpResponse.json(manageLinksPut);
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
  http.post("/api/blog-posts/manage-followers/", () => {
    return HttpResponse.json(followSuccess);
  }),
  http.delete("/api/blog-posts/manage-followers/", () => {
    return HttpResponse.json(unfollowSuccess);
  }),
  http.get("/api/blog-posts/manage-following/oscar/", () => {
    return HttpResponse.json(isFollowingSelf, { status: 404 });
  }),
  http.post("/api/blog-posts/manage-post-reactions/", () => {
    return HttpResponse.json(createReactionSuccess);
  }),
  http.get("/media/profile_pictures/pfp.png", () => {
    return HttpResponse.json({});
  }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

afterAll(() => server.close());

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

export default server;
