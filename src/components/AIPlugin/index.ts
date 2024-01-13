import {
  EditorView,
  DecorationSet,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { isInAiBlock } from "./isInAiBlock";
const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

let isResponse = false;

export const AiInputPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = isInAiBlock(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = isInAiBlock(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,

    eventHandlers: {
      keydown: (e, view) => {
        let target = e.target as HTMLElement;

        if (
          target.nodeName == "SPAN" &&
          target.parentElement!.classList.contains("cm-ai-widget")
        ) {
          if (target.textContent == "Enter your command here...") {
            target.textContent = "";
          }
          if (e.key == "Enter" && !e.shiftKey && !isResponse) {
            let newText;
            const currentDoc = view.state.doc.toString();
            if (currentDoc !== "") {
              const splitDoc = currentDoc.split("/ai>");
              const prefix = splitDoc[0];
              const suffix = splitDoc[1];

              newText = prefix + suffix;
            }

            const spinner = document.querySelector(".cm-ai-spinner");

            spinner?.classList.add("spinner");
            e.preventDefault();
            let index = 0;
            let query =
              newText !== ""
                ? `Given this document: ${newText}, respond to this user query ${target.textContent}`
                : target.textContent;
            electronAPI.onOpenai(query).then((response: string) => {
              spinner?.classList.remove("spinner");
              isResponse = true;
              target.setAttribute("contenteditable", "false");

              function type() {
                if (index < response.length) {
                  target.textContent += response.charAt(index);
                  index++;
                  setTimeout(type, 50);
                } else {
                  createActionKeys(target, view);
                  target.setAttribute("contenteditable", "true");
                }
              }

              if (response) {
                target.textContent = "";

                type();
              }
            });
          }
          if (e.key == "Escape") {
            const { state, visibleRanges } = view;

            for (let { from, to } of visibleRanges) {
              syntaxTree(state).iterate({
                from: from,
                to: to,
                enter: (node) => {
                  if (node.type.name == "AiMark") {
                    view.dispatch({
                      changes: {
                        from: node.from,
                        to: node.to,
                      },
                    });
                  }
                },
              });
            }
          }
        }
      },
    },
  }
);

function createActionKeys(target: HTMLElement, view: EditorView) {
  const btnwrapper = document.createElement("div");
  btnwrapper.className = "cm-ai-btn-wrapper";
  const copyButton = document.createElement("button");
  copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

  copyButton.addEventListener("click", () => {
    let selection = target.textContent;
    if (selection) {
      navigator.clipboard.writeText(selection);
    }
  });

  const regenerateButton = document.createElement("button");
  regenerateButton.textContent = "Regenerate";
  regenerateButton.addEventListener("click", () => {
    const spinner = document.querySelector(".cm-ai-spinner");
    spinner?.classList.add("spinner");
    let index = 0;
    electronAPI
      .onOpenai("Regenerate the last response")
      .then((response: string) => {
        isResponse = true;
        target.textContent = "";
        spinner?.classList.remove("spinner");
        target.setAttribute("contenteditable", "false");

        function type() {
          if (index < response.length) {
            target.textContent += response.charAt(index);
            index++;
            setTimeout(type, 50);
          }
        }

        type();
      });
  });

  const insertButton = document.createElement("button");
  insertButton.textContent = "Insert";
  insertButton.addEventListener("click", () => {
    const currentDoc = view.state.doc.toString();
    const splitDoc = currentDoc.split("/ai>");
    const prefix = splitDoc[0];
    const suffix = splitDoc[1];

    view.dispatch({
      changes: {
        from: 0,
        to: currentDoc.length,
        insert: prefix + target.textContent + suffix,
      },
    });
  });

  btnwrapper.appendChild(copyButton);
  btnwrapper.appendChild(regenerateButton);
  btnwrapper.appendChild(insertButton);

  target.parentElement!.appendChild(btnwrapper);
}
