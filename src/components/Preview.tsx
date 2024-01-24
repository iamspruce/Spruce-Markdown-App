import React from "react";
import Prism from "prismjs";
import "prismjs/components/index";
import "prismjs/themes/prism.css";
import cheerio from "cheerio";
import { decode } from "html-entities";
import { usePreferences } from "@/context/AppPreferenceProvider";

type PreviewProps = {
  content: string;
  scrollPos: number;
};

const Preview: React.FC<PreviewProps> = ({ content, scrollPos }) => {
  const previewRef = React.useRef<HTMLDivElement>(null);
  const previewParentRef = React.useRef<HTMLDivElement>(null);
  const { preferences } = usePreferences();

  React.useEffect(() => {
    // Check if previewRef.current is not null before accessing its properties
    if (previewRef.current) {
      if (preferences?.ifCodeHighlight) {
        const $ = cheerio.load(content);
        const $codes = $("code[class^=language]");

        if ($codes.length > 0) {
          $codes.each(function () {
            const $code = $(this);
            const lang = $code.attr("class")!.replace("language-", "");
            const code = decode($code.html());

            try {
              const highlightSnippet = Prism.highlight(
                code,
                Prism.languages[lang],
                lang
              );

              $code.html(highlightSnippet);
              $code.parent("pre").addClass(`language-${lang}`);
            } catch (error) {
              // Handle the error as per your application needs
            }
          });

          content = $.html();
        }
      }

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
