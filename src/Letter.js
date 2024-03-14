import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

export const Letter = ({ uuid }) => {
  // const link =require(axios local link)

  const docs = [
    // { uri: "https://url-to-my-pdf.pdf" }, // Remote file
    {
      uri: `http://127.0.0.1:8000/letters/${uuid}.pdf`,
      // uri: require("./Letters/letter.docx"),
    }, // Local File
  ];

  return (
    <div>
      Letter
      <DocViewer
        documents={docs}
        initialActiveDocument={docs[1]}
        pluginRenderers={DocViewerRenderers}
      />
    </div>
  );
};
