import { useEffect } from "react";
import PostComponent from "../components/PostComponent";
import { useDispatch } from "react-redux";
import { checkPostType } from "../features/authStore/authSlice";
import { TYPE_LIST } from "../features/types";

function List() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkPostType(TYPE_LIST));
  });
  return <PostComponent />;
}

export default List;
