function CommentThumbnail({ content }) {
  return (
    <li
      className={
        content.is_read == false
          ? "comment-thumbnail unread"
          : "comment-thumbnail"
      }
    >
      <h3>{content.user.username} said:</h3>
      <p>{content.content}</p>
    </li>
  );
}

export default CommentThumbnail;
