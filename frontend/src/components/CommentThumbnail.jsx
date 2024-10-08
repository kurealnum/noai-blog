function CommentThumbnail({ content }) {
  return (
    <div className="comment-thumbnail">
      {content.user.username} said {content.content}
    </div>
  );
}

export default CommentThumbnail;
