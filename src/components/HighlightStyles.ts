import {} from "@/utils/commands";
import { tags, tagHighlighter } from "@lezer/highlight";

const highlightStyles = tagHighlighter([
  { tag: tags.heading1, class: "editor_h1" },
  { tag: tags.heading2, class: "editor_h2" },
  { tag: tags.heading3, class: "editor_h3" },
  { tag: tags.heading4, class: "editor_h4" },
  { tag: tags.heading5, class: "editor_h5" },
  { tag: tags.heading6, class: "editor_h6" },
  { tag: tags.emphasis, class: "editor_emph" },
  { tag: tags.strong, class: "editor_strong" },
  { tag: tags.contentSeparator, class: "editor_hrule" },
  { tag: tags.list, class: "editor_list" },
  { tag: tags.link, class: "editor_link" },
  { tag: tags.comment, class: "editor_comment" },
  { tag: tags.quote, class: "editor_qoute" },
  { tag: tags.strikethrough, class: "editor_strikethrough" },
]);

export default highlightStyles;
