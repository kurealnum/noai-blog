import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div id="landing-page">
        <h1>
          Because <span className="accent-highlight">blogs</span> shouldn't be
          written by <span className="accent-highlight">robots</span>.
        </h1>
        <Link to={"/feed"}>
          Take a look
          <ArrowForwardIosIcon />
        </Link>
      </div>
      <div className="info-box">
        <h2>No more AI generated content.</h2>
        <p>
          We don’t even allow AI assisted content. Check out how we moderate
          this{" "}
          <Link to="/guidelines" className="tertiary-accent">
            here
          </Link>
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
        <Link to="/register" id="link-button">
          Sign Up <ArrowForwardIosIcon />
        </Link>
      </div>
    </div>
  );
}

export default Home;
