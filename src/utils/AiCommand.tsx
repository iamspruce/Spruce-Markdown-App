import {
  StateCommand,
  Text,
  EditorState,
  EditorSelection,
  ChangeSpec,
  countColumn,
} from "@codemirror/state";
import { syntaxTree, indentUnit } from "@codemirror/language";
import { SyntaxNode, Tree } from "@lezer/common";
import { BlockContext, Line, MarkdownConfig } from "@lezer/markdown";

class Context {
  constructor(
    readonly node: SyntaxNode,
    readonly from: number,
    readonly to: number,
    readonly spaceBefore: string,
    readonly spaceAfter: string,
    readonly type: string,
    readonly item: SyntaxNode | null
  ) {}

  blank(maxWidth: number | null, trailing = true) {
    let result = this.spaceBefore + "/ai>" + (maxWidth != null ? " " : "");
    if (maxWidth != null) {
      while (result.length < maxWidth) result += " ";
      return result;
    } else {
      return result;
    }
  }
}

function getContext(node: SyntaxNode, doc: Text) {
  let nodes = [];
  for (
    let cur: SyntaxNode | null = node;
    cur && cur.name != "Document";
    cur = cur.parent
  ) {
    if (cur.name == "AiMark") nodes.push(cur);
  }
  let context = [];
  for (let i = nodes.length - 1; i >= 0; i--) {
    let node = nodes[i],
      match;
    let line = doc.lineAt(node.from),
      startPos = node.from - line.from;
    if (node.name == "AiMark") {
      context.push(new Context(node, startPos, startPos, "", "", "", null));
    }
  }
  return context;
}
