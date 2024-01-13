import { EditorView, WidgetType, Rect } from "@codemirror/view";

export class AiInputWidget extends WidgetType {
  constructor(readonly isInBlock: boolean) {
    super();
  }

  eq(widget: WidgetType): boolean {
    return this.isInBlock;
  }

  toDOM(view: EditorView): HTMLElement {
    let span = document.createElement("span");
    span.className = "cm-ai-widget";
    let input = span.appendChild(document.createElement("span"));
    let spinner = span.appendChild(document.createElement("div"));
    spinner.className = "cm-ai-spinner";
    input.setAttribute("contenteditable", "true");
    input.innerText = "Enter your command here...";
    return span;
  }

  ignoreEvent(event: Event): boolean {
    return false;
  }
  coordsAt(dom: HTMLElement, pos: number, side: number): Rect | null {
    let input = (
      dom.querySelector(".cm-ai-widget span") as HTMLElement
    ).focus();
    input;

    return null;
  }
}
