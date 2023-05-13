import ReactQuill, { Quill } from "react-quill";
import Mentions from "quill-mention";

Quill.register("modules/mention", Mentions);

type RichEditorProps = {
  onChange: (value: string) => void;
  value: string;
};

// TODO: Search for mentions
// const mentionSource = (searchTerm, renderList) => {
//   const mentions = [
//     { id: 1, value: "John Doe", mentionClass: "custom-mention" },
//     { id: 2, value: "Jane Smith", mentionClass: "custom-mention" },
//     // Add more mention items as needed
//   ];

//   const matchedItems = mentions.filter(
//     (mention) =>
//       mention.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
//   );

//   renderList(matchedItems);
// };

const Editor = ({ onChange, value }: RichEditorProps) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          // [
          //   {
          //     mention: { mentionDenotationChars: ["@"], source: mentionSource },
          //   },
          // ],
          ["clean"],
        ],
        // mention: {
        //   allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        //   mentionDenotationChars: ["@"],
        //   source: mentionSource,
        // },
      }}
    />
  );
};

export default Editor;
