// Anything abbreviated with f_ (such as f_GET_LIST) refers to a URL on the frontend, AKA from React Router.
function reverseUrl(name, args) {
  const base_url = "/api/";
  switch (name) {
    case "USER_INFO":
      return add_args(base_url + "accounts/user-info/", args);
    case "LIST_FEED":
      return add_args(base_url + "lists/feed/", args);
    case "GET_BLOG_POST":
      return add_args(base_url + "blog-posts/get-post/", args);
    case "GET_LIST":
      return add_args(base_url + "lists/get-list/", args);
    case "GET_BLOG_POST_COMMENTS":
      return add_args(base_url + "blog-posts/get-comments/", args);
    case "GET_LIST_COMMENTS":
      return add_args(base_url + "lists/get-comments/", args);
    case "MANAGE_BLOG_POST_REACTIONS":
      return add_args(base_url + "blog-posts/manage-post-reactions/", args);
    case "MANAGE_LIST_REACTIONS":
      return add_args(base_url + "lists/manage-list-reactions/", args);
    case "CREATE_LIST_COMMENT":
      return add_args(base_url + "lists/create-comment/");
    case "CREATE_BLOG_POST_COMMENT":
      return add_args(base_url + "blog-posts/create-comment/");
    case "DELETE_LIST_COMMENT":
      return add_args(base_url + "lists/delete-comment/", args);
    case "DELETE_BLOG_POST_COMMENT":
      return add_args(base_url + "blog-posts/delete-comment/", args);
    case "EDIT_LIST_COMMENT":
      return add_args(base_url + "lists/edit-comment/", args);
    case "EDIT_BLOG_POST_COMMENT":
      return add_args(base_url + "blog-posts/edit-comment/", args);
    case "FLAG_LIST":
      return add_args(base_url + "lists/toggle-flagged-post/", args);
    case "FLAG_BLOG_POST":
      return add_args(base_url + "blog-posts/toggle-flagged-post/", args);
    case "FLAG_LIST_COMMENt":
      return add_args(base_url + "lists/toggle-flagged-comment/", args);
    case "FLAG_BLOG_POST_COMMENT":
      return add_args(base_url + "blog-posts/toggle-flagged-comment/", args);
    case "GET_BLOG_POSTS":
      return add_args(base_url + "blog-posts/get-posts/", args);
    case "GET_LISTS":
      return add_args(base_url + "lists/get-lists/", args);
    case "CREATE_LIST":
      return add_args(base_url + "lists/create-list/", args);
    case "CREATE_BLOG_POST":
      return add_args(base_url + "blog-posts/create-post/", args);
    case "f_GET_BLOG_POST":
      return add_args("/post/", args);
    case "f_GET_LIST":
      return add_args("/list/", args);
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
