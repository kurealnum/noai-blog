import { Link } from "react-router-dom";

function Faq() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is byeAI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "byeAI is a blogging website for software developers and computer people alike that completely disallows AI generated content.",
        },
      },
      {
        "@type": "Question",
        name: "How does byeAI detect AI generated content?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We have a standardized system in place that helps take care of AI generated/assisted posts. You can read more about this in our guidelines.",
        },
      },
      {
        "@type": "Question",
        name: "What kind of content cand I find on byeAI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You expect to see high quality content on byeAI, written by awesome computer people without the assistance of AI.",
        },
      },
      {
        "@type": "Question",
        name: "Can I view the source code of byeAI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "byeAI is not open source. However, if you’re curious about the inner workings of a certain part of byeAI, please send an email to thenoaiblog@gmail.com.",
        },
      },
      {
        "@type": "Question",
        name: "Can I nominate something to be added to the FAQ/guidelines?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Probably. Please send an email to thenoaiblog@gmail.com specifically asking what you’d like to see changed.",
        },
      },
      {
        "@type": "Question",
        name: "How big should my thumbnails be on byeAI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "16:9. If you're interested in creating highly detailed thumbnails, consider using a free tool like Canva or Gimp.",
        },
      },
      {
        "@type": "Question",
        name: "Can I make a blog post without including a thumbnail on byeAI?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, however we strongly encourage you to include a thumbnail, even if it's just the logo of your favorite framework.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      ></script>
      <div className="text-based-page">
        <h1>FAQ</h1>
        <h2>What is byeAI?</h2>
        <p>
          byeAI is a blogging website for software developers and computer
          people alike that completely disallows AI generated content.
        </p>
        <h2>How does byeAI detect AI generated content?</h2>
        <p>
          We have a standardized system in place that helps take care of AI
          generated/assisted posts. You can read more about this in our{" "}
          <Link to="/guidelines">guidelines</Link>.
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
          <a href="mailto: thenoaiblog@gmail.com">thenoaiblog@gmail.com</a>.
        </p>
        <h2>Can I nominate something to be added to the FAQ/guidelines?</h2>
        <p>
          Probably. Please send an email to{" "}
          <a href="mailto: thenoaiblog@gmail.com">thenoaiblog@gmail.com</a>
          specifically asking what you’d like to see changed.
        </p>
        <h2>How big should my thumbnails be on byeAI?</h2>
        <p>
          16:9. If you're interested in creating highly detailed thumbnails,
          considering using a free tool like Canva or Gimp.
        </p>
        <h2>Can I make a blog post without including a thumbnail on byeAI?</h2>
        <p>
          Yes, however we strongly encourage you to include a thumbnail, even if
          it's just the logo of your favorite framework.
        </p>
      </div>
    </>
  );
}

export default Faq;
