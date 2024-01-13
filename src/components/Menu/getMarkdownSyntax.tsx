export type MarkdownSyntaxLabel =
  | "Header 1"
  | "Image"
  | "Table"
  | "Link"
  | "Ordered List"
  | "Unordered List"
  | "Summarize"
  | "Ask"
  | "Write";

export type MarkdownSyntaxMap = {
  [Key in MarkdownSyntaxLabel]: string;
};

export const getMarkdownSyntax = (label: MarkdownSyntaxLabel): string => {
  // Define the Markdown syntax for each label
  const markdownSyntaxMap: MarkdownSyntaxMap = {
    "Header 1": "# ",
    Image: "![Alt text](url)",
    Table:
      "| Header 1 | Header 2 |\n| ---------- | ---------- |\n| Row 1, Col 1 | Row 1, Col 2 |",
    Link: "[Link Text](url)",
    "Ordered List": "1. ",
    "Unordered List": "- ",
    Summarize: "/chat>",
    Ask: "/chat>",
    Write: "/chat>",
  };

  // Get the Markdown syntax for the given label
  const markdownSyntax = markdownSyntaxMap[label] || "";

  return markdownSyntax;
};
