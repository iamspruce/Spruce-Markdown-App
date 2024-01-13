import { syntaxTree } from "@codemirror/language";
import { EditorView, DecorationSet, Decoration } from "@codemirror/view";
import { AiInputWidget } from "./AiInputWidget";

export const isInAiBlock = (view: EditorView): DecorationSet => {
  const { state, visibleRanges } = view;

  let isInBlock = false;
  let widgets: any = [];

  for (let { from, to } of visibleRanges) {
    syntaxTree(state).iterate({
      from: from,
      to: to,
      enter: (node) => {
        if (node.type.name == "AiMark") {
          isInBlock = true;
          let deco = Decoration.widget({
            widget: new AiInputWidget(isInBlock),
            side: 2,
          });

          widgets.push(deco.range(node.to));
        }
      },
    });
  }

  return Decoration.set(widgets);
};
