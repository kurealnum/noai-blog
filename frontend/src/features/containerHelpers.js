// File specifically for helper functions for *containers*
import getCookie from "./helpers";

async function getUserInfo(username) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(
    "/api/accounts/user-info-by-username/" + username + "/",
    config,
  );
  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function getBlogPosts(username) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(
    "/api/blog-posts/get-posts/" + username + "/",
    config,
  );
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
  const response = await fetch(
    "/api/accounts/manage-links/" + username + "/",
    config,
  );
  if (response.ok) {
    return await response.json();
  }
  return null;
}

async function changeSettings(newUserData, setIsError, setIsSaved, newLinks) {
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
  if (userInfoResponse.ok && linksResponse.ok) {
    setIsSaved(true);
  } else {
    setIsError(true);
  }
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
  const response = await fetch("/api/blog-posts/get-comments/", config);
  if (response.ok) {
    return await response.json();
  }
  return null;
}

export {
  getLinks,
  getUserInfo,
  getBlogPosts,
  createLink,
  deleteLink,
  changeSettings,
  getComments,
};
