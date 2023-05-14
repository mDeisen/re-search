import { useRouter } from "next/router";
import { useState } from "react";

const PublicationPage = () => {
  const router = useRouter();

  let response = { __html: "<p>some html</p>" };

  const [reviewText, setReviewText] = useState("");
  const [accepted, setAccepted] = useState(false);

  const handleTextChange = (event: any) => {
    setReviewText(event.target.value);
  };

  const handleToggleChange = (event: any) => {
    setAccepted(!accepted);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const articleId = router.query.slug;
    // Submit the review using reviewText and acceptedTerms
  };

  return (
    <div>
      <div
        className="max-w-lg mx-auto"
        dangerouslySetInnerHTML={{
          __html: "<h1>The Content</h1><p>asdf asdf</p>",
        }}
      />
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <br />
        <hr />
        <label
          htmlFor="review-text"
          className="block font-medium text-gray-700 mb-2"
        >
          Review
        </label>
        <textarea
          id="review-text"
          name="review-text"
          placeholder="Enter review here..."
          value={reviewText}
          onChange={handleTextChange}
          className="textarea w-full"
          rows={4}
        />

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Accept Article for Publication</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={handleToggleChange}
              checked={accepted}
            />
          </label>
        </div>

        <button type="submit" className={`btn btn-outline btn-primary`}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default PublicationPage;
