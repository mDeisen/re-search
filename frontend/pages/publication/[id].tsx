import { useGetPublicationQuery } from "@/rtk/lenspub.api";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";

const PublicationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useGetPublicationQuery(id as string);

  // @ts-ignore
  let response = { __html: data?.lensPub.metadata.content };

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
    <div className="flex flex-col justify-center items-center">
      <div className="w-2/3">
        <h1 className="text-2xl border">{data?.graphPub.title}</h1>
        <div className=" border mx-auto" dangerouslySetInnerHTML={response} />
        <form onSubmit={handleSubmit} className="">
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
                className={classNames("toggle", accepted && "toggle-success")}
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
    </div>
  );
};

export default PublicationPage;
