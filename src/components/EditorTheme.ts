// EditorTheme.ts
import { EditorView } from "@codemirror/view";

const editorTheme = EditorView.theme({
  "&": {
    color: "var(--editor-foreground)",
    background: "var(--editor-background)",
    padding: "20px",
    paddingTop: "10px",
  },
  ".cm-content": {
    caretColor: "var(--editor-caret)",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "var(--editor-caret)",
  },
  "&.cm-focused .cm-selectionBackground, ::selection": {
    backgroundColor: "var(--editor-selection-background)",
    color: "var(--editor-selection-foreground)",
  },
});

export default editorTheme;
