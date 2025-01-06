import { TYPE_BLOG_POST, TYPE_LIST } from "../features/types";

function postInfoReducer(state, action) {
  switch (action.payload) {
    case TYPE_LIST:
      return { ...state, postInfo: { type: "list" } };
    case TYPE_BLOG_POST:
      return { ...state, postInfo: { type: "blogPost" } };
    default:
      return { ...state };
  }
}

export default postInfoReducer;
