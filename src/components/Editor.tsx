"use client";
import React, { useEffect, useRef, useState } from "react";
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";

import { EditorSelection, EditorState, Text } from "@codemirror/state";
import {
  EditorView,
  keymap,
  drawSelection,
  highlightSpecialChars,
  rectangularSelection,
} from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import {
  markdown,
  markdownKeymap,
  markdownLanguage,
} from "@codemirror/lang-markdown";

/* Preview */
import Preview from "./Preview";

/* Editor styles */
import highlightStyles from "./HighlightStyles";
import editorTheme from "./EditorTheme";

/* menu */
import Menu from "./Menu";
import {
  getMarkdownSyntax,
  MarkdownSyntaxLabel,
} from "./Menu/getMarkdownSyntax";

/* AiPlugin */
import { AiInputPlugin } from "./AIPlugin";
import { AiCommand } from "@/utils/commands";
import SelectionMenu from "./SelectionMenu";
import { useDoc } from "@/context/DocProvider";

const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

const Editor = ({}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView>();
  const [previewContent, setPreviewContent] = useState<string>("");
  const { initialDoc, updateDoc } = useDoc();

  /* Show menu */
  const [showMenu, setShowMenu] = useState(false);
  const [selection, setSelection] = useState("");
  const [showSelectionMenu, setSelectionShowMenu] = useState(false);
  const [showSelectionMenuPos, setSelectionShowMenuPos] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [typedText, setTypedText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  const handleKeyUp = async (event: KeyboardEvent) => {
    if (event.key === "/" && editorViewRef.current) {
      const coords = editorViewRef.current.coordsAtPos(
        editorViewRef.current.state.selection.main.head
      );
      setCursorPosition({ top: coords!.top + 20, left: coords!.left });
      setShowMenu(true);
    }
  };

  const handleMenuItemClick = (item: MarkdownSyntaxLabel) => {
    setTypedText(item);
    setShowMenu(false);
    const cursor = editorViewRef.current!.state.selection.main.head;
    const content = editorViewRef.current!.state.doc.toString();
    const prefix = content.slice(0, cursor - 1);
    const suffix = content.slice(cursor);

    // Check if the clicked item is "Image"
    if (item === "Image") {
      // Trigger logic for the "Image" button
      handleImageClick();
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
  const handleSelectionMenuItemClick = (buttonId: string) => {
    let changes = [];
    let from = editorViewRef.current!.state.selection.main.from;
    let to = editorViewRef.current!.state.selection.main.to;

    switch (buttonId) {
      case "bold":
        const isBold =
          editorViewRef.current!.state.sliceDoc(from - 2, from) == "**";
        const isBoldAfter =
          editorViewRef.current!.state.sliceDoc(to, to + 2) == "**";
        changes.push(
          isBold
            ? {
                from: from - 2,
                to: from,
                insert: Text.of([""]),
              }
            : {
                from: from,
                insert: Text.of(["**"]),
              }
        );
        changes.push(
          isBoldAfter
            ? {
                from: to,
                to: to + 2,
                insert: Text.of([""]),
              }
            : {
                from: to,
                insert: Text.of(["**"]),
              }
        );

        editorViewRef.current!.dispatch({
          changes,
        });
        break;
      case "italic":
        const isItalic =
          editorViewRef.current!.state.sliceDoc(from - 1, from) == "_" ||
          editorViewRef.current!.state.sliceDoc(from - 1, from) == "*";
        const isItalicAfter =
          editorViewRef.current!.state.sliceDoc(to, to + 1) == "_" ||
          editorViewRef.current!.state.sliceDoc(to, to + 1) == "*";

        changes.push(
          isItalic
            ? {
                from: from - 1,
                to: from,
                insert: Text.of([""]),
              }
            : {
                from: from,
                insert: Text.of(["_"]),
              }
        );
        changes.push(
          isItalicAfter
            ? {
                from: to,
                to: to + 1,
                insert: Text.of([""]),
              }
            : {
                from: to,
                insert: Text.of(["_"]),
              }
        );

        editorViewRef.current!.dispatch({
          changes,
        });
        break;
      case "underline":
        console.log("Underline button clicked");
        // Add logic for handling underline action
        break;
      case "link":
        const isLink =
          editorViewRef.current!.state.sliceDoc(from - 1, from) == "[";
        const isLinkAfter =
          editorViewRef.current!.state.sliceDoc(to, to + 1) == "]";

        changes.push(
          isLink
            ? {
                from: from - 1,
                to: from,
                insert: Text.of([""]),
              }
            : {
                from: from,
                insert: Text.of(["["]),
              }
        );
        changes.push(
          isLinkAfter
            ? {
                from: to,
                to: to + 1,
                insert: Text.of([""]),
              }
            : {
                from: to,
                insert: Text.of(["]()"]),
              }
        );

        editorViewRef.current!.dispatch({
          changes,
        });
        break;

      case "Improve Writing":
        console.log("Improve Writing");
        break;
      case "Fix Spelling and Grammar":
        console.log("Improve Writing");
        break;
      case "Summarize":
        console.log("Improve Writing");
        break;
      case "Expand":
        console.log("Improve Writing");
        break;
      case "Continue Writing":
        console.log("Improve Writing");
        break;
      case "Simple":
        console.log("Improve Writing");
        break;
      case "Professional":
        console.log("Improve Writing");
        break;
      default:
        console.log("Unknown button clicked");
    }
  };

  const handleImageClick = async () => {
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

  // Update the preview content whenever the editor content changes
  const onUpdate = EditorView.updateListener.of((change) => {
    const editorContent = change.state.doc.toString();
    setPreviewContent(
      micromark(editorContent, {
        extensions: [gfm()],
        htmlExtensions: [gfmHtml()],
        allowDangerousProtocol: true,
      })
    );

    /* update the doc */
    updateDoc(editorContent);

    /* hide menu if open */
    setShowMenu(false);
  });

  useEffect(() => {
    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        markdown({
          codeLanguages: [],
          base: markdownLanguage,
          //@ts-ignore
          extensions: [AiCommand],
        }),
        EditorView.lineWrapping,
        EditorState.allowMultipleSelections.of(true),
        highlightSpecialChars(),
        drawSelection(),
        rectangularSelection(),
        keymap.of(markdownKeymap),
        AiInputPlugin,
        syntaxHighlighting(highlightStyles),
        editorTheme,
        onUpdate,
      ],
    });

    const view = new EditorView({
      state,
      parent: contentRef.current!,
      dispatch: (tr) => {
        view.update([tr]);
      },
    });

    view.dom.addEventListener("keyup", handleKeyUp);
    view.dom.addEventListener("mouseup", () => {
      const selection = editorViewRef.current!.state.sliceDoc(
        editorViewRef.current!.state.selection.main.from,
        editorViewRef.current!.state.selection.main.to
      );

      if (selection) {
        const range = window.getSelection()?.getRangeAt(0);

        if (range) {
          const rect = range.getBoundingClientRect();

          setSelectionShowMenuPos({
            top: rect!.top - 50,
            bottom: rect!.bottom,
            left: rect!.left,
            right: rect!.right,
          });
          setSelectionShowMenu(true);
          setSelection(selection);
        }
      } else {
        setSelectionShowMenu(false);
      }
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [highlightStyles, initialDoc]);

  return (
    <>
      <section className="editor panel" id="panel1">
        <div
          id="editor_content"
          ref={contentRef}
          role="textbox"
          tabIndex={0}
        ></div>
        <Menu
          show={showMenu}
          cursorPosition={cursorPosition}
          isPro={""}
          onItemClick={(item) => handleMenuItemClick(item)}
        />
        <SelectionMenu
          show={showSelectionMenu}
          pos={showSelectionMenuPos}
          onMenuItemClick={handleSelectionMenuItemClick}
        />
      </section>
      <Preview content={previewContent} />
    </>
  );
};

export default Editor;
