import { Link } from "react-router-dom";
function AboutUs() {
  return (
    <div className="text-based-page">
      <h1>
        AI Free. <span className="accent-highlight">Forever.</span>
      </h1>
      <p>
        We believe that AI has no place in human writing. If you agree, we
        suggest you stick around.
      </p>
      <h2>About Us</h2>
      <p>
        Hi, I’m Oscar. From the spring of 2023, to the spring of 2024, I spent a
        lot of time on Dev.to (and I still do – it’s a wonderful platform).
        Somewhere along the way, it occurred to me that the biggest issue Dev.to
        had wasn’t anything like hateful people, a lack of moderation, an issue
        with accessibility, or anything else. The biggest issue Dev.to had was
        the influx of AI generated content. ChatGPT was just getting big, and no
        one had any idea what to do about it. However, I had a few ideas that I
        organized and shared as a research paper (which I also submitted for my
        AP English final – a win-win), and thus, the idea of byeAI was born.
        Since mid-August of 2024, we’ve been chugging along, one AI-free commit
        at a time. I sincerely hope you enjoy this project. If you’d like to
        give any feedback, please feel free to reach out. You can find contact
        information on the{" "}
        <Link to="/guidelines" className="tertiary-accent">
          guidelines
        </Link>
        page.
      </p>
    </div>
  );
}

export default AboutUs;
