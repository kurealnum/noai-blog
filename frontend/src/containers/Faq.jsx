function Faq() {
  return (
    <div className="text-based-page">
      <h1>FAQ</h1>
      <h2>What is byeAI?</h2>
      <p>
        byeAI is a blogging website for software developers and computer people
        alike that completely disallows AI generated content.
      </p>
      <h2>How does byeAI detect AI generated content?</h2>
      <p>
        We have a standardized system in place that helps take care of AI
        generated/assisted posts. You can read more about this in our
        [Guidelines].
      </p>
      <h2>What kind of content can I find on byeAI?</h2>
      <p>
        You expect to see high quality content on byeAI, written by awesome
        computer people without the assistance of AI.
      </p>
      <h2>Can I view the source code of byeAI?</h2>
      <p>
        byeAI is not open source. However, if you’re curious about the inner
        workings of a certain part of byeAI, please send an email to{" "}
        <a className="tertiary-accent" href="mailto: thenoaiblog@gmail.com">
          thenoaiblog@gmail.com
        </a>
        .
      </p>
      <h2>Can I nominate something to be added to the FAQ/guidelines?</h2>
      <p>
        Probably. Please send an email to
        <a className="tertiary-accent" href="mailto: thenoaiblog@gmail.com">
          thenoaiblog@gmail.com
        </a>
        specifically asking what you’d like to see changed.
      </p>
      <h2>How big should my thumbnails be on byeAI?</h2>
      <p>
        16:9. If you're interested in creating highly detailed thumbnails,
        considering using a free tool like Canva or Gimp.
      </p>
    </div>
  );
}

export default Faq;
