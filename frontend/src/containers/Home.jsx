import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Home() {
  return (
    <div>
      <div id="landing-page">
        <h1>
          Because <span className="accent-highlight">blogs</span> shouldn't be
          written by <span className="accent-highlight">robots</span>.
        </h1>
        <a href="/feed">
          Take a look <ArrowForwardIosIcon />
        </a>
      </div>
      <div className="info-box">
        <h2>No more AI generated content.</h2>
        <p>
          We don’t even allow AI assisted content. Check out how we moderate
          this{" "}
          <a className="tertiary-accent" href="/guidelines">
            here
          </a>
          .
        </p>
      </div>
      <div className="info-box">
        <h2>Blogs are meant to be human written.</h2>
        <p>Developer posts have lost their touch. Let's change that.</p>
      </div>
      <div className="info-box">
        <h2>No blogs? No problem.</h2>
        <p>
          If you aren’t a fan of blogs, consider sticking around. We’ll be
          releasing more AI-free content in the future.
        </p>
        <a id="link-button" href="/register">
          Sign Up <ArrowForwardIosIcon />
        </a>
      </div>
    </div>
  );
}

export default Home;
