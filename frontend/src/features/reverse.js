function reverse_url(name, args) {
  const base_url = "/api/";
  switch (name) {
    case "USER_INFO":
      return add_args(base_url + "accounts/user-info/", args);
  }
}

function add_args(url, args) {
  if (args) {
    return url + args.join("/") + "/";
  } else {
    return url;
  }
}

export default reverse_url;
