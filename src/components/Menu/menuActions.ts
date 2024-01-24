import { EditorView } from "@codemirror/view";
import { getMarkdownSyntax, MarkdownSyntaxLabel } from "./getMarkdownSyntax";
const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

export const handleMenuItemClick = (
  item: MarkdownSyntaxLabel,
  editorViewRef: any
) => {
  const cursor = editorViewRef.current!.state.selection.main.head;
  const content = editorViewRef.current!.state.doc.toString();
  const prefix = content.slice(0, cursor - 1);
  const suffix = content.slice(cursor);

  // Check if the clicked item is "Image"
  if (item === "Image") {
    // Trigger logic for the "Image" button
    handleImageClick(editorViewRef);
    return;
  }

  const markdownSyntax: string = getMarkdownSyntax(item);

  // Insert the markdownSyntax at the cursor position
  const newText = prefix + markdownSyntax + suffix;

  // Replace the current editor content with the updated text
  const tr = editorViewRef.current!.state.update({
    changes: { from: 0, to: content.length, insert: newText },
  });

  // Apply the transaction to the editor view
  editorViewRef.current!.dispatch(tr);
};

const handleImageClick = async (editorViewRef: any) => {
  // Trigger the file selection dialog in the main process
  const selectedFilePath = await electronAPI.selectImage();

  if (selectedFilePath) {
    // Construct markdown syntax with the selected file path
    const imageSource = `file://${selectedFilePath}`;
    const markdownSyntax = `![Alt text](${imageSource})`;

    // Insert the markdownSyntax at the cursor position
    const cursor = editorViewRef.current!.state.selection.main.head;
    const content = editorViewRef.current!.state.doc.toString();
    const prefix = content.slice(0, cursor - 1);
    const suffix = content.slice(cursor);
    const newText = prefix + markdownSyntax + suffix;

    // Replace the current editor content with the updated text
    const tr = editorViewRef.current!.state.update({
      changes: { from: 0, to: content.length, insert: newText },
    });

    // Apply the transaction to the editor view
    editorViewRef.current!.dispatch(tr);
  }
};
