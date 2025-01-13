import PostComponent from "../components/PostComponent";
import { useDispatch } from "react-redux";
import { checkPostType } from "../features/authStore/authSlice";
import { TYPE_LIST } from "../features/types";

function List() {
  const dispatch = useDispatch();
  dispatch(checkPostType(TYPE_LIST));
  return <PostComponent />;
}

export default List;
