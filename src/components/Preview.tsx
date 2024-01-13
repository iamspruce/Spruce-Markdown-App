import React, { useEffect, useRef } from "react";

type PreviewProps = {
  content: string;
};

const Preview: React.FC<PreviewProps> = ({ content }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if previewRef.current is not null before accessing its properties
    if (previewRef.current) {
      // Update the preview content whenever the 'content' prop changes
      previewRef.current.innerHTML = content;
    }
  }, [content]);

  return (
    <section className="preview panel" id="panel2">
      <div id="preview_content" ref={previewRef}></div>
    </section>
  );
};

export default Preview;
