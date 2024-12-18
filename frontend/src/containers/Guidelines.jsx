import { Link } from "react-router-dom";

function Guidelines() {
  return (
    <div className="text-based-page">
      <h1>Guidelines</h1>
      <p>
        As you should know by now, byeAI doesn’t allow any sort of AI generated
        content. That’s not our only rule though! Here’s all the “fun” rules we
        have.
      </p>
      <p>
        (If you're looking for the about us section, click{" "}
        <Link className="tertiary-accent" to="/about-us">
          here
        </Link>
        . And if you're looking for the FAQ, click{" "}
        <Link to="/faq" className="tertiary-accent">
          here
        </Link>
        .)
      </p>
      <h2>Contact Information</h2>
      <p>
        Please use{" "}
        <a
          className="tertiary-accent"
          href="https://form.jotform.com/242828369788175"
        >
          this anonymous form
        </a>{" "}
        to submit an incident report. Alternatively, for more general requests,
        you can send an email to{" "}
        <a className="tertiary-accent" href="mailto: thenoaiblog@gmail.com">
          thenoaiblog@gmail.com
        </a>
      </p>
      <h2>The basics</h2>
      <p>
        This is our general code of conduct. Please do read over it. There might
        be a surprise!
      </p>
      <p>
        Be nice. We’d love to stop here, but just in case, here’s all the things
        that fall under “be nice”:
      </p>
      <ul>
        <li>Be respectful of differing viewpoints</li>
        <li>
          Focus on building each other up, not tearing each other down. If
          someone disagrees with you, find a way to learn from it.
        </li>
        <li>
          Avoid language and actions that may be perceived as bullying,
          harassment, or discrimination.
        </li>
        <li>
          Any sexist, homophobic, racist, transphobic, and otherwise unpleasant
          language will not be tolerated. We understand that some content may
          contain profanity for one reason or another, but please keep it to a
          minimum. Additionally, any profanity or hateful language directed
          towards a group, a culture, or a specific person will not be
          tolerated.
        </li>
        <li>
          Do your best to be empathetic. You have not lived the life that
          someone else has lived.
        </li>
      </ul>
      <p>
        The violation of any of these rules may result in the removal of the
        offender’s account.
      </p>
      <p>
        <i>P.S: There was no suprise.</i>
      </p>
      <h2 id="no-ai-generated-or-assisted-content">
        No AI generated or AI assisted content
      </h2>
      <p>
        This is the important one! Content that is found to be AI generated/AI
        assisted will be removed, but content that is only suspected to be AI
        generated/AI assisted will result in a message to the author of the post
        asking for “proof” of creation (read more about this in{" "}
        <a href="#suspected-content" className="tertiary-accent">
          the section about handling content that is suspected to be AI
          generated.
        </a>
        ).
      </p>
      <h3>How are you detecting AI generated/AI assisted content?</h3>
      <p>
        We depend almost entirely on our users and manual moderation. In other
        words, we understand that 90% of content that is posted here is almost
        certainly not AI generated/AI assisted. Thus, dealing with the leftover
        10% by hand is a much easier task.
      </p>
      <p>So how do we deal with that leftover 10%? Good question.</p>
      <p>
        Before we begin, I (the author of these guidelines and the founder of
        byeAI – Oscar) would like to make a personal note. I <i>always</i> err
        on the side of caution, and even when all of the checks listed below
        prove to be positive, I, and anyone else moderating byeAI, will try to
        find a way to resolve the situation without immediately removing the
        content.
      </p>
      <p>
        Getting back on topic now... Firstly, the suspected content will be
        tested with{" "}
        <a href="https://gptzero.me/" className="tertiary-accent">
          GPTZero
        </a>{" "}
        or a similar tool. byeAI understands that tools like this can be
        inaccurate on occasion, and thus we won’t derive the likelihood that a
        piece of content is AI generated based solely off of this.
      </p>
      <p>
        Secondly, we attempt to replicate a blog post using AI. We do this by
        extracting a few sentences from an article that seems to summarize it
        best (for example, the conclusion), and asking AI to write a blog post
        based off of that summary. If both this test and GPTZero gave a positive
        result, we’ll normally call it a day, and mark this post as AI
        assisted/AI generated (which again, will result in this article being
        removed).
      </p>
      <p>
        If we get to the third step and we still suspect a post to be AI
        generated, we’ll go through the author’s post/comment history both on
        byeAI and any other social media sites (ex. Github, Twitter, etc.) that
        the author has linked in their profile to inspect for any
        inconsistencies. Some examples may be:
      </p>
      <ul>
        <li>
          Are the majority of the author’s comments/posts AI generated (solely
          according to GPT Zero)?
        </li>
        <li>
          Does this user have a history of consistently making comments and/or
          posts with a completely different tone/choice of words than the
          suspected post?
        </li>
        <li>Is the poster’s account brand new (less than a week old)?</li>
        <li>Does the author post more than once a day?</li>
      </ul>
      <p>
        It should be noted that if a piece of content reaches this third step,
        it will no longer be considered solely as AI generated/AI assisted
        content, and it will instead be considered as suspected AI generated/AI
        assisted content. This is important because a post that is simply found
        to be AI generated/AI assisted will be removed without warning, while a
        post that is suspected to be AI generated/AI assisted will only result
        in a friendly email to the author asking for “proof” of creation (read
        more about this in{" "}
        <a href="#suspected-content" className="tertiary-accent">
          the section about handling content that is suspected to be AI
          generated.
        </a>
        ).
      </p>
      <p>
        If you have any suggestions about this system, we’d love to hear it.
        byeAI would prefer to minimize any and all possible biases in this
        process, so your feedback is important.
      </p>
      <h3 id="suspected-content">
        My content was suspected to be AI generated/AI assisted! What do I do?
      </h3>
      <p>
        If you’re reading this, you’ve probably received an email that sounds
        something along the lines of this:
      </p>
      <p>
        <i>Hi So-and-So!</i>
      </p>
      <p>
        <i>
          Your content that you posted on byeAI is suspected to be AI
          generated/AI assisted. Please provide evidence that you yourself
          generated this content.
        </i>
      </p>
      <p>
        Firstly, please ensure that the email was sent from{" "}
        <a href="mailto: thenoaiblog@gmail.com" className="tertiary-accent">
          thenoaiblog@gmail.com
        </a>
        . If it was not, the email may be a phishing attempt. Please fill out an
        incident report.
      </p>
      <p>
        If you’ve gotten this far, you’ll need to provide evidence that you,
        without the assistance of AI, created that piece of content. Here are
        some acceptable ways to prove that:
      </p>
      <ul>
        <li>
          Search history related to your content. For instance, if you were
          making a blog post on the origins of Javascript, you would likely have
          a lengthy search history relating to the history of Javascript.
        </li>
        <li>Version history with Google Docs (or something similar)</li>
        <li>Notes of any kind, in any format</li>
        <li>An outline of your post</li>
        <li>Commit history (if it is relevant to your content)</li>
        <li>
          Anything else that proves you put in time and effort into your post.
          Any sort of history, logs, even a text to your friend asking about the
          history of Javascript would suffice.
        </li>
      </ul>
      <p>
        We don’t want to play detective. But at the same time, we don’t want any
        AI generated/AI assisted content on byeAI. In summary, please make this
        easy for us. Our goal isn’t to harass our users – it’s to have a
        positive and AI free community filled with your awesome content.
      </p>
      <h3>So what’s the limit on AI usage?</h3>
      <p>
        This isn’t a cult. byeAI has no problem with an author using AI to
        assist themselves in coding or most other activities that may relate to
        byeAI (we would prefer if code that is included in content wasn’t
        completely AI generated, but even if it is, we can’t enforce it). The
        only thing that byeAI explicitly prohibits is the usage of artificial
        intelligence in content posted to byeAI.
      </p>
      <p>
        However, if you’d like to ask an AI a question, then use another
        resource to validate the AI’s answer, you may. For instance, if you were
        writing a post about HTML and didn’t understand what a paragraph element
        was, it would be appropriate for me to ask ChatGPT to explain it, then
        make your way to MDN and cite their definition of a paragraph as a
        resource in my post. It would not be appropriate for me to copy and
        paste the answer that ChatGPT gave to me directly into my post.
      </p>
      <h3 id="ai-assistance-information">
        I’m an author that isn’t fluent in English, but uses AI to help me
        translate my work into English. What about me?
      </h3>
      <p>
        Please contact{" "}
        <a href="mailto: thenoaiblog@gmail.com" className="tertiary-accent">
          thenoaiblog@gmail.com
        </a>
        . We would be happy to make accommodations for you – these
        accommodations would likely be “immunity” from AI checks, and a little
        sticker on your profile that says you’re approved to use AI. Optionally,
        you may remain anonymous (until we have to approve your content for AI
        usage, of course) by submitting a question through the incident report.
      </p>
      <h2>No listicles</h2>
      <a href="#what-is-a-listicle" className="tertiary-accent">
        But what is a listicle?
      </a>
      <p>
        This is not a strict rule. byeAI understands that some content is simply
        presented best in the format of a listicle, and we don’t want to
        prohibit quality content that simply happens to take the form of a
        listicle. However, we do ask that you keep articles in a list format to
        a minimum. If you would like to write a listicle, please:
      </p>
      <ul>
        <li>
          Avoid clickbait-y titles such as “Top 20 sites to learn CSS 🤩🤩🤩”.
          Instead, opt for a more mature title such as “I compiled a list of the
          best sites to learn CSS”.
        </li>
        <li>
          If you find yourself writing what feels like a low effort summary of
          technologies that you’ve heard of, stop and reconsider how you’re
          presenting the content.
        </li>
        <li>
          Pick a side. Either stay as far away from list-based content as
          possible, or go full force into it. For clarity, check out{" "}
          <a
            href="https://dev.to/afif/i-made-100-css-loaders-for-your-next-project-4eje"
            className="tertiary-accent"
          >
            this example
          </a>{" "}
          of a listicle. This content clearly takes the form of a listicle, but
          it does so in a way that makes it easily accessible as a resource. It
          provides a table of contents and a concise list of CSS loaders.
        </li>
      </ul>
      <p>
        If posts are found to be violating any of the above rules, they will not
        be removed. The post will simply be marked as a listicle and thus, it
        will receive a penalty on byeAI’s ranking algorithm.
      </p>
      <h3 id="what-is-a-listicle">What is a listicle?</h3>
      <p>
        byeAI views a listicle as any content that provides information in the
        format of a list, with each list item containing a summary or a short
        “report” of the topic. For instance:
      </p>
      <p>
        1. Apples: Apples are a fruit that grows on a tree. There are many
        different kinds of apples. They are grown worldwide and are very
        popular.
      </p>
      <p>
        <i>... and so on</i>
      </p>
      <h2>Some more content guidelines</h2>
      <p>
        We expect the content on this site to be reasonably high quality, and
        suited for computer people. Your content may be removed if:
      </p>
      <ul>
        <li>
          It does not involve computers. Everything including (but certainly not
          limited to) software, hardware, your computer-related experiences,
          Arduinos, and your computer-related job is fine, but anything that
          doesn’t focus on computers may be removed.
        </li>
        <li>
          It is blatantly low quality. Posts that look like a rough draft, and
          are no more than 8 or so sentences long may be removed (with the clear
          exception of discussion posts and any other posts that warrant a short
          and low effort body)
        </li>
        <li>
          It is sexually explicit. There’s no excuse for anything inappropriate
          on a blogging platform for computer people.
        </li>
        <li>
          It violates the privacy rights of any other users on the platform (ex.
          doxxing someone).
        </li>
        <li>It violates any of the above guidelines.</li>
        <li>
          It is overly political (see{" "}
          <a href="#keep-politics-out-of-it" className="tertiary-accent">
            this section about politics
          </a>
          ).
        </li>
        <li>
          It is illegal. This includes violation of copyrights, trademarks, and
          defamatory content.
        </li>
      </ul>
      <h2 id="keep-politics-out-of-it">Keep politics out of it</h2>
      <p>
        This is a community of computer people (and a few non computer people as
        well), not a debate board. If politics directly relates to a computer
        thing that you wish to discuss, you may include it. However, if a post
        is seen to be primarily focusing on the political aspect that the author
        brought in, it will be removed.
      </p>
      <h2>Organizations & Organizational Accounts</h2>
      <p>
        An organization is defined as any type of organized group (501c3,
        corporation, etc.), or a representative of an organization (as
        previously defined). If your organization would like to promote their
        content on our site, please contact{" "}
        <a href="mailto: thenoaiblog@gmail.com" className="tertiary-accent">
          thenoaiblog@gmail.com
        </a>{" "}
        for inquiries about advertising. Otherwise, creating/posting content to
        byeAI is not permitted.
      </p>
      <h2>Representatives</h2>
      <p>
        If you are a representative of an organization, you may not post content
        from your organization on byeAI.
      </p>
      <h2> Promotion-based posts</h2>
      <p>
        You may not accept payment of any kind to create a post. If you would
        like to create a post for an organization/product out of the goodness of
        your heart, you may.
      </p>
      <h2
        id="green-checkmarks-on-users-profiles"
        name="green-checkmarks-on-users-profiles"
      >
        Green Checkmarks on user's profiles
      </h2>
      <p>
        This checkmark indicates that a user has been approved to use AI
        assistance to help create their content. See{" "}
        <a className="tertiary-accent" href="#ai-assistance-information">
          this section
        </a>{" "}
        for more info.
      </p>
      <h1>Sources Cited</h1>
      <p>
        These guidelines were created in inspiration from the following
        guidelines/sites:
      </p>
      <ul>
        <li>
          <a
            href="https://nationalmtb.org/wp-content/uploads/Student-Athlete-Code-Of-Conduct-041723.pdf"
            className="tertiary-accent"
          >
            Nica Code of Conduct
          </a>
        </li>
        <li>
          <a href="https://dev.to/code-of-conduct" className="tertiary-accent">
            Dev.to Code of Conduct
          </a>
        </li>
        <li>
          <a
            href="https://docs.daily.dev/docs/for-content-creators/content-guidelines"
            className="tertiary-accent"
          >
            Daily.dev Content Guidelines
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Guidelines;
