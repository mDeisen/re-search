import ReactMarkdown from "react-markdown";

const MarkdownDisplay = ({ markdown }: { markdown: string }) => {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
};

export default MarkdownDisplay;
