import { useEffect } from "react";
import PostComponent from "../components/PostComponent";
import { useDispatch } from "react-redux";
import { checkPostType } from "../features/authStore/authSlice";
import { TYPE_BLOG_POST } from "../features/types";

function BlogPost() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkPostType(TYPE_BLOG_POST));
  });
  return <PostComponent />;
}

export default BlogPost;
