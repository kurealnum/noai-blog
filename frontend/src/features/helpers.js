import store from "./authStore/store";
import reverseUrl from "./reverseUrl";

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

function getPostType() {
  return store.getState()["store"]["postInfo"]["type"];
}

async function getUserInfo() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(reverseUrl("USER_INFO"), config);
  if (response.ok) {
    return await response.json();
  }
  return {};
}

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}

async function getUserInfoByUsername(username) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(reverseUrl("USER_INFO", [username]), config);
  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function getPosts(username, type) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };

  let url;
  if (type === "list") {
    url = reverseUrl("GET_LISTS", [username]);
  } else if (type === "blogPost") {
    url = reverseUrl("GET_BLOG_POSTS", [username]);
  }

  const response = await fetch(url, config);
  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function getLinks(username) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  if (username == null) {
    const response = await fetch("/api/accounts/manage-links/", config);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } else {
    const response = await fetch(
      "/api/accounts/manage-links/" + username + "/",
      config,
    );
    if (response.ok) {
      return await response.json();
    }
    return null;
  }
}

async function changeSettings(
  newUserData,
  setIsError,
  setIsSaved,
  newLinks,
  profilePicture,
) {
  const userInfoConfig = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PUT",
    body: JSON.stringify(newUserData),
  };
  const userInfoResponse = await fetch(
    "/api/accounts/update-user-info/" + getCookie("user_id") + "/",
    userInfoConfig,
  );

  const linksConfig = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PUT",
    body: JSON.stringify(newLinks),
  };
  const linksResponse = await fetch("/api/accounts/manage-links/", linksConfig);

  // do this in case the user hasn't selected an image (doesn't mess up the other requests, but messes up the UI)
  var isImageUploadOk = false;

  if (profilePicture == null) {
    isImageUploadOk = true;
  } else {
    // we use form data to send images
    let data = new FormData();
    data.append("profile_picture", profilePicture["profile_picture"]);
    data.append("user", "hubot");

    const imageFetchConfig = {
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      credentials: "include",
      method: "PATCH",
      body: data,
    };
    const imageResponse = await fetch(
      "/api/accounts/save-profile-picture/",
      imageFetchConfig,
    );
    if (imageResponse.ok) {
      isImageUploadOk = true;
    } else {
      isImageUploadOk = false;
    }
  }

  if (userInfoResponse.ok && linksResponse.ok && isImageUploadOk) {
    setIsSaved(true);
    return true;
  }
  setIsError(true);
  return false;
}

async function deleteLink(link) {
  const linksConfig = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "DELETE",
    body: JSON.stringify(link),
  };
  const linksResponse = await fetch("/api/accounts/manage-links/", linksConfig);
  return linksResponse.ok;
}

async function createLink(link) {
  const linksConfig = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "POST",
    body: JSON.stringify(link),
  };
  const linksResponse = await fetch("/api/accounts/manage-links/", linksConfig);
  return linksResponse.ok;
}

async function getComments() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/manage-comments/", config);
  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function getPost(username, slug) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };

  const type = getPostType();

  let url;
  if (type === "list") {
    url = reverseUrl("GET_LIST", [username, slug]);
  } else if (type === "blogPost") {
    url = reverseUrl("GET_BLOG_POST", [username, slug]);
  }

  const response = await fetch(url, config);
  if (response.ok) {
    return await response.json();
  }
  throw new Error("Post not found!");
}

async function register(formData) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    credentials: "include",
    body: JSON.stringify(formData),
  };
  const response = await fetch("/api/accounts/register/", config);
  return response.ok;
}

async function getFeed(index) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/feed/" + index + "/", config);
  return await response.json();
}

async function getListFeed(index) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(reverseUrl("LIST_FEED", [index]), config);
  return await response.json();
}

async function createPost({ newBlogPost, thumbnail }) {
  let data = new FormData();
  data.append("thumbnail", thumbnail["thumbnail"]);
  data.append("content", newBlogPost["content"]);
  data.append("title", newBlogPost["title"]);
  data.append("user", "hubot");

  const config = {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "POST",
    credentials: "include",
    body: data,
  };
  const response = await fetch("/api/blog-posts/create-post/", config);

  if (!response.ok) {
    // only give the user one error message at a time
    const errorMessages = await response.json();
    const thrownErrorMessageKey = Object.keys(errorMessages)[0];
    const thrownErrorMessage = errorMessages[thrownErrorMessageKey];
    throw new Error(thrownErrorMessage);
  }
}

async function doesPathExist(path) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };

  if (path == null) {
    return false;
  }

  const response = await fetch(path, config);
  return response.ok;
}

function limitLength(string, len) {
  return string.length > len ? string.slice(0, len + 1) : string;
}

async function followUser(username) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ followee: username }),
  };

  const response = await fetch("/api/blog-posts/manage-followers/", config);
  return response.ok;
}

async function unfollowUser(username) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify({ followee: username }),
  };

  const response = await fetch("/api/blog-posts/manage-followers/", config);
  return response.ok;
}

// should 404 if user is not following
async function isFollowingUser(username) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };

  const response = await fetch(
    "/api/blog-posts/manage-following/" + username + "/",
    config,
  );
  return response.ok;
}

async function createReaction(slug, username, type) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ slug: slug, username: username }),
  };

  let url;
  if (type === "list") {
    url = reverseUrl("MANAGE_LIST_REACTIONS");
  } else if (type === "blogPost") {
    url = reverseUrl("MANAGE_BLOG_POST_REACTIONS");
  }

  const response = await fetch(url, config);
  return response.ok;
}

async function deleteReaction(slug, type) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "DELETE",
    body: JSON.stringify({ slug: slug }),
  };

  let url;
  if (type === "list") {
    url = reverseUrl("MANAGE_LIST_REACTIONS");
  } else if (type === "blogPost") {
    url = reverseUrl("MANAGE_BLOG_POST_REACTIONS");
  }

  const response = await fetch(url, config);
  return response.ok;
}

async function getReaction(slug, username) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    method: "GET",
  };

  const type = getPostType();

  let url;
  if (type === "list") {
    url = reverseUrl("MANAGE_LIST_REACTIONS", [username, slug]);
  } else if (type === "blogPost") {
    url = reverseUrl("MANAGE_BLOG_POST_REACTIONS", [username, slug]);
  }

  const response = await fetch(url, config);
  return response.ok;
}

async function getNotifications() {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    method: "GET",
  };

  const response = await fetch("/api/accounts/notifications/", config);
  return await response.json();
}

async function deletePost(slug) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "DELETE",
    body: JSON.stringify({ slug: slug }),
  };

  const response = await fetch("/api/blog-posts/delete-post/", config);
  return response.ok;
}

async function editPost({ newBlogPost, thumbnail, originalSlug }) {
  let data = new FormData();
  data.append("thumbnail", thumbnail["thumbnail"]);
  data.append("content", newBlogPost["content"]);
  data.append("title", newBlogPost["title"]);
  data.append("title_slug", slugify(newBlogPost["title"]));
  data.append("original_slug", originalSlug);
  data.append("user", "hubot");

  const config = {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "PUT",
    credentials: "include",
    body: data,
  };
  const response = await fetch("/api/blog-posts/edit-post/", config);
  if (!response.ok) {
    // only give the user one error message at a time
    const errorMessages = await response.json();
    const thrownErrorMessageKey = Object.keys(errorMessages)[0];
    const thrownErrorMessage = errorMessages[thrownErrorMessageKey];
    throw new Error(thrownErrorMessage);
  }
}

async function getCommentsByPost(username, slug) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    method: "GET",
  };

  const type = getPostType();

  let url;
  if (type === "list") {
    url = reverseUrl("GET_LIST_COMMENTS", [username, slug]);
  } else if (type === "blogPost") {
    url = reverseUrl("GET_BLOG_POST_COMMENTS", [username, slug]);
  }

  const response = await fetch(url, config);
  return await response.json();
}

// cleans up date time field from Django
function cleanDateTimeField(date) {
  return date.replace(/(T.*)/g, "");
}

async function deleteComment(id) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "DELETE",
  };

  const type = getPostType();

  let url;
  if (type === "list") {
    url = reverseUrl("DELETE_LIST_COMMENT", [id]);
  } else if (type === "blogPost") {
    url = reverseUrl("DELETE_BLOG_POST_COMMENT", [id]);
  }

  const response = await fetch(url, config);
  return response.ok;
}

async function editComment(id, content) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PATCH",
    body: JSON.stringify({ content: content }),
  };

  const type = getPostType();

  let url;
  if (type === "list") {
    url = reverseUrl("EDIT_LIST_COMMENT", [id]);
  } else if (type === "blogPost") {
    url = reverseUrl("EDIT_BLOG_POST_COMMENT", [id]);
  }

  const response = await fetch(url, config);
  return response.ok;
}

async function createComment(username, slug, content, replyTo) {
  if (!replyTo) {
    replyTo = "";
  }
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      username: username,
      slug: slug,
      content: content,
      reply_to: replyTo,
    }),
  };

  const type = getPostType();

  let url;
  if (type === "list") {
    url = reverseUrl("CREATE_LIST_COMMENT");
  } else if (type === "blogPost") {
    url = reverseUrl("CREATE_BLOG_POST_COMMENT");
  }

  const response = await fetch(url, config);
  return response.ok;
}

async function getFollowers() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/manage-followers/", config);
  return await response.json();
}

async function getFollowing() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/manage-following/", config);
  return await response.json();
}

async function getNotificationCount() {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/accounts/notifications-count/", config);
  return await response.json();
}

function isMod() {
  const currentStore = store.getState().store;
  return currentStore.isMod || currentStore.isAdmin || currentStore.isSuperuser;
}

function isAdmin() {
  const currentStore = store.getState().store;
  return currentStore.isAdmin || currentStore.isSuperuser;
}

function isSuperuser() {
  const currentStore = store.getState().store;
  return currentStore.isSuperuser;
}

function isAuthenticated() {
  const currentStore = store.getState().store;
  return currentStore.isAuthenticated;
}

// hasUserBeenWarned could just be passed as true, yes, but it's just there in case this function is called without (somehow) understanding that it will delete all of the users stuff
async function deleteAccount(hasUserBeenWarned) {
  if (hasUserBeenWarned === true) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      method: "DELETE",
      credentials: "include",
    };
    const response = await fetch("/api/accounts/delete-account/", config);
    return response.status;
  }
}

// MODERATOR FUNCTIONS
async function toggleFlagPost(username, slug) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PATCH",
  };
  const type = getPostType();

  let url;
  if (type === "list") {
    url = reverseUrl("FLAG_LIST", [username, slug]);
  } else if (type === "blogPost") {
    url = reverseUrl("FLAG_BLOG_POST", [username, slug]);
  }

  const response = await fetch(url, config);
  return response.ok;
}

async function toggleFlagComment(id) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PATCH",
  };

  const type = getPostType();

  let url;
  if (type === "list") {
    url = reverseUrl("FLAG_LIST", [id]);
  } else if (type === "blogPost") {
    url = reverseUrl("FLAG_BLOG_POST", [id]);
  }

  const response = await fetch(url, config);
  return response.ok;
}

async function toggleFlagUser(username) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PATCH",
  };
  const response = await fetch(
    "/api/blog-posts/toggle-flagged-user/" + username + "/",
    config,
  );
  return response.ok;
}
// END OF MODERATOR FUNCTIONS
// ---
// ADMIN FUNCTIONS
async function getFlaggedPosts() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-flagged-posts/", config);
  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function getFlaggedComments() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-flagged-comments/", config);
  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function getFlaggedUsers() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch("/api/blog-posts/get-flagged-users/", config);
  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function toggleListicle(username, slug) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    credentials: "include",
    method: "PATCH",
  };

  const response = await fetch(
    "/api/blog-posts/toggle-listicle/" + username + "/" + slug + "/",
    config,
  );
  return response.ok;
}

async function adminDeletePost(username, slug) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "DELETE",
    credentials: "include",
  };

  const response = await fetch(
    "/api/blog-posts/admin/manage-post/" + username + "/" + slug + "/",
    config,
  );
  return response.ok;
}

async function adminDeleteComment(id) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "DELETE",
    credentials: "include",
  };

  const response = await fetch(
    "/api/blog-posts/admin/manage-comment/" + id + "/",
    config,
  );
  return response.ok;
}

async function adminDeleteUser(username) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    method: "DELETE",
    credentials: "include",
  };

  const response = await fetch(
    "/api/blog-posts/admin/manage-user/" + username + "/",
    config,
  );
  return response.ok;
}
// END OF ADMIN FUNCTIONS

async function search(type, query, page) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
    credentials: "include",
  };

  // if there's no query given, we don't want to include it in the url
  let url = "";
  if (query != null) {
    url = "/api/search/" + type + "/" + query + "/" + page + "/";
  } else {
    url = "/api/search/" + type + "/" + page + "/";
  }
  const response = await fetch(url, config);
  return await response.json();
}

export {
  search,
  deleteAccount,
  adminDeleteUser,
  adminDeleteComment,
  adminDeletePost,
  toggleListicle,
  getFlaggedPosts,
  getFlaggedUsers,
  getFlaggedComments,
  isAuthenticated,
  isMod,
  isAdmin,
  isSuperuser,
  toggleFlagPost,
  toggleFlagComment,
  toggleFlagUser,
  getNotificationCount,
  getFollowing,
  getFollowers,
  createComment,
  editComment,
  deleteComment,
  cleanDateTimeField,
  editPost,
  getCommentsByPost,
  deletePost,
  getNotifications,
  createReaction,
  deleteReaction,
  getReaction,
  isFollowingUser,
  followUser,
  unfollowUser,
  getLinks,
  getUserInfoByUsername,
  getPosts,
  createLink,
  deleteLink,
  changeSettings,
  getComments,
  getPost,
  getUserInfo,
  register,
  slugify,
  limitLength,
  getFeed,
  createPost,
  doesPathExist,
  getListFeed,
  getPostType,
};

export default getCookie;
