import { Link } from "react-router-dom";

function UserDocumentation() {
  return (
    <div className="text-based-page">
      <h1 id="reporting-issues-requesting-features">
        Reporting issues & requesting features
      </h1>
      <p>
        You can report issues and request features{" "}
        <a href="https://github.com/kurealnum/byeAI">on our GitHub</a>. We are
        always open to suggestions.
      </p>

      <h1 id="managing-your-content">Managing your content</h1>
      <p>
        You can manage all of your content from your dashboard! This includes:
        creating a post, deleting a post, editing a post, viewing who’s
        following you, and viewing who you’re following. If you choose to delete
        your account, all of your posts will be deleted.
      </p>

      <h1 id="managing-your-comments">Managing your comments</h1>
      <p>
        Currently, byeAI does not provide one central hub for managing all of
        your comments (if this is a feature you’d like to see, please open an
        issue <a href="https://github.com/kurealnum/byeAI">on our GitHub</a>).
        However, you can edit and delete your comments on the post that you made
        them on. Additionally, if you choose to delete your account, all of your
        comments will be deleted as well.
      </p>

      <h1 id="managing-your-account">Managing your account</h1>
      <p>
        As this page will be mentioned quite a bit,{" "}
        <Link to="/settings">the settings tab is located here.</Link>
      </p>

      <h2 id="deleting-your-account">Deleting your account</h2>
      <p>
        We’re sorry to see you go! If you’d really, really, really like to
        delete your account, you may do so under the Settings tab. This is
        permanent, and all of your posts and comments will be deleted.
      </p>

      <h2 id="changing-your-password">Changing your password</h2>
      <p>You can change your password under the Settings tab.</p>

      <h1 id="publishing-a-post">Publishing a post</h1>
      <p>
        All about publishing your first (or second, or third, etc..) post! As
        per the <Link to="/guidelines">guidelines</Link>, we do ask that your
        post be of reasonable quality as well as at least 8 sentences long (with
        the clear exception of discussion posts and any other posts that warrant
        a short and low effort body).
      </p>

      <h2 id="required-fields">Required fields</h2>
      <ul>
        <li>
          <strong>Post type:</strong> What kind of post are you creating? Are
          you creating a generic article, or a listicle?
        </li>
        <li>
          <strong>Title:</strong> (We hope this would be obvious)
        </li>
        <li>
          <strong>Content:</strong> Create your post with markdown, images, and
          code blocks! Check this{" "}
          <a href="https://www.markdownguide.org/basic-syntax/">
            markdown guide
          </a>{" "}
          out for some information on formatting.
        </li>
      </ul>

      <h2 id="optional-fields">Optional fields</h2>
      <ul>
        <li>
          <strong>Thumbnail:</strong> 16:9 is the preferred aspect ratio for
          thumbnails. If you don’t include a thumbnail, this will be your post’s
          thumbnail: (SHOW THUMBNAIL)
        </li>
        <li>
          <strong>Crosspost:</strong> You can optionally include a link on your
          post to allow the user to navigate to either your blog or another site
          similar to byeAI, such as Dev.to or Daily.dev.
        </li>
      </ul>

      <h1 id="navigating-your-feed">Navigating your feed</h1>
      <p>
        While feeds aren’t incredibly customizable (yet!), you do have the
        option of viewing general articles or listicles. General articles are,
        well, general articles! Opinion pieces, news, tutorials, really anything
        that isn’t a listicle. As for listicles, please see the definition of
        listicles in our <Link to="/guidelines">guidelines</Link>.
      </p>
    </div>
  );
}

export default UserDocumentation;
