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
      return add_args(base_url + "list/get-list/", args);
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
