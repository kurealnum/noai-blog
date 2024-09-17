// File specifically for helper functions for *containers*
import getCookie from "./helpers";

async function getUserInfo(username) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(
    "/api/accounts/user-info/" + username + "/",
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

  // this code is weirdly written, but my lsp keeps yelling at me unless i do it this way
  if (username == null) {
    const response = await fetch("/api/blog-posts/get-posts/", config);
    if (response.ok) {
      return await response.json();
    }
  } else {
    const response = await fetch(
      "/api/blog-posts/get-posts/" + username + "/",
      config,
    );
    if (response.ok) {
      return await response.json();
    }
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

async function getBlogPost({ username, slug }) {
  const config = {
    headers: { "Content-Type": "application/json" },
    method: "GET",
    credentials: "include",
  };
  const response = await fetch(
    "/api/blog-posts/get-post/" + username + "/" + slug + "/",
    config,
  );
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
  getBlogPost,
};
