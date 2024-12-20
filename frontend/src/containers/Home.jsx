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
        <h2>Absolutely no AI generated content.</h2>
        <p>
          Not even AI assisted content is allowed. Check out how we moderate
          this <Link to="/guidelines">in our guidelines</Link>.
        </p>
      </div>
      <div className="info-box">
        <h2>Blogs are meant to be human written.</h2>
        <p>Content made by developers has lost its touch. Let's change that.</p>
      </div>
      <div className="info-box">
        <h2>No blogs? No problem.</h2>
        <p>
          If you aren’t a fan of traditional articles, consider sticking around.
          We’ll be releasing more AI-free content in the future.
        </p>
        <Link to="/register" id="link-button">
          Sign Up <ArrowForwardIosIcon />
        </Link>
      </div>
    </div>
  );
}

export default Home;
