// Anything abbreviated with f_ (such as f_GET_LIST) refers to a URL on the frontend, AKA from React Router.
function reverseUrl(name, args) {
  const baseUrl = "/api/";

  switch (name) {
    case "USER_INFO":
      return add_args(baseUrl + "accounts/user-info/", args);
    case "GET_LIST_FEED":
      return add_args(baseUrl + "blog-posts/feed/", args);
    case "GET_BLOG_POST_FEED":
      return add_args(baseUrl + "blog-posts/feed/", args);
    case "GET_BLOG_POST":
      return add_args(baseUrl + "blog-posts/get-post/", args);
    case "GET_LIST":
      return add_args(baseUrl + "blog-posts/get-post/", args);
    case "GET_BLOG_POST_COMMENTS":
      return add_args(baseUrl + "blog-posts/get-comments/", args);
    case "GET_LIST_COMMENTS":
      return add_args(baseUrl + "blog-posts/get-comments/", args);
    case "MANAGE_BLOG_POST_REACTIONS":
      return add_args(baseUrl + "blog-posts/manage-post-reactions/", args);
    case "MANAGE_LIST_REACTIONS":
      return add_args(baseUrl + "blog-posts/manage-post-reactions/", args);
    case "CREATE_LIST_COMMENT":
      return add_args(baseUrl + "blog-posts/create-comment/");
    case "CREATE_BLOG_POST_COMMENT":
      return add_args(baseUrl + "blog-posts/create-comment/");
    case "DELETE_LIST_COMMENT":
      return add_args(baseUrl + "blog-posts/delete-comment/", args);
    case "DELETE_BLOG_POST_COMMENT":
      return add_args(baseUrl + "blog-posts/delete-comment/", args);
    case "EDIT_LIST_COMMENT":
      return add_args(baseUrl + "blog-posts/edit-comment/", args);
    case "EDIT_BLOG_POST_COMMENT":
      return add_args(baseUrl + "blog-posts/edit-comment/", args);
    case "FLAG_LIST":
      return add_args(baseUrl + "blog-posts/toggle-flagged-post/", args);
    case "FLAG_BLOG_POST":
      return add_args(baseUrl + "blog-posts/toggle-flagged-post/", args);
    case "FLAG_LIST_COMMENT":
      return add_args(baseUrl + "blog-posts/toggle-flagged-comment/", args);
    case "FLAG_BLOG_POST_COMMENT":
      return add_args(baseUrl + "blog-posts/toggle-flagged-comment/", args);
    case "GET_BLOG_POSTS":
      return add_args(baseUrl + "blog-posts/get-posts/", args);
    case "GET_LISTS":
      return add_args(baseUrl + "blog-posts/get-posts/", args);
    case "CREATE_LIST":
      return add_args(baseUrl + "blog-posts/create-post/", args);
    case "CREATE_BLOG_POST":
      return add_args(baseUrl + "blog-posts/create-post/", args);
    case "EDIT_BLOG_POST":
      return add_args(baseUrl + "blog-posts/edit-post/", args);
    case "EDIT_LIST":
      return add_args(baseUrl + "blog-posts/edit-post/", args);
    case "DELETE_LIST":
      return add_args(baseUrl + "blog-posts/delete-post/", args);
    case "DELETE_BLOG_POST":
      return add_args(baseUrl + "blog-posts/delete-post/", args);
    case "f_GET_BLOG_POST":
      return add_args("/post/", args);
    case "f_GET_LIST":
      return add_args("/list/", args);
    case "f_EDIT_BLOG_POST":
      return add_args("/edit-post/", args);
    case "f_EDIT_LIST":
      return add_args("/edit-post/", args);
  }
}

function add_args(url, args) {
  if (args) {
    return url + args.join("/") + "/";
  } else {
    return url;
  }
}

export default reverseUrl;
