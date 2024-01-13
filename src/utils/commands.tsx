import { insertNewlineContinueMarkup } from "@codemirror/lang-markdown";
import { styleTags, tags as defaultTags, Tag } from "@lezer/highlight";
import { BlockContext, Line, MarkdownConfig } from "@lezer/markdown";

// Define a custom tag for the ask tag
export const AiTag = {
  AiMark: Tag.define(),
};

// Define the parsing and styling for the ask tag
export const AiCommand: MarkdownConfig = {
  defineNodes: [
    {
      name: "AiMark",
      style: {
        AiMark: defaultTags.processingInstruction,
        "AiMark/...": AiTag.AiMark,
      },
    },
  ],
  parseBlock: [
    {
      name: "AiMark",
      parse(cx: BlockContext, line: Line): boolean {
        const prefix = "/ai>";

        if (line.text.startsWith(prefix)) {
          // Calculate the adjusted start and end positions to exclude the "/ai>" prefix
          const adjustedStart = cx.lineStart;
          const adjustedEnd = adjustedStart + prefix.length;

          // Create the AiMark node with adjusted start and end positions
          let ainode = cx.elt("AiMark", adjustedStart, adjustedEnd);

          cx.addElement(ainode);

          return false;
        }

        return false;
      },
    },
  ],
};
