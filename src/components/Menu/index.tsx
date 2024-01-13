// Menu.tsx
import React from "react";
import {
  Hash,
  Image,
  Link,
  List,
  CheckSquare,
  Check,
  AlertCircle,
  BookOpen,
  Code,
  Mic,
  Edit,
  Table,
} from "react-feather"; // Import the Feather icons
type MarkdownSyntaxLabel =
  | "Header 1"
  | "Image"
  | "Table"
  | "Link"
  | "Ordered List"
  | "Unordered List";

interface MenuProps {
  show: boolean;
  cursorPosition: { top: number; left: number };
  isPro: string | null;
  onItemClick: (item: MarkdownSyntaxLabel) => void;
}

const Menu: React.FC<MenuProps> = ({
  show,
  cursorPosition,
  isPro,
  onItemClick,
}) => {
  const basicMenuItems = [
    {
      label: "Header 1",
      icon: <Hash size={"16px"} />,
      tooltip: "Insert Header 1",
    },
    { label: "Image", icon: <Image size={"16px"} />, tooltip: "Insert Image" },
    { label: "Table", icon: <Table size={"16px"} />, tooltip: "Insert Table" },
    { label: "Link", icon: <Link size={"16px"} />, tooltip: "Insert Link" },
    {
      label: "Ordered List",
      icon: <List size={"16px"} />,
      tooltip: "Insert Ordered List",
    },
    {
      label: "Unordered List",
      icon: <CheckSquare size={"16px"} />,
      tooltip: "Insert Unordered List",
    },
  ];

  const aiPoweredMenuItems = [
    {
      label: "Grammar Analysis",
      icon: <Check size={"16px"} />,
      tooltip: "Analyze grammar in the document",
      confirmationMessage:
        "This will analyze the grammar in the document. Do you want to proceed?",
      keyboardShortcut: "Ctrl+G",
      onClick: handleGrammarAnalysisClick, // Replace with your actual click handler
    },
    {
      label: "Summarize",
      icon: <AlertCircle size={"16px"} />,
      tooltip: "Generate a summary of the document",
      confirmationMessage:
        "This will generate a summary of the document. Do you want to proceed?",
      keyboardShortcut: "Ctrl+S",
      /* onClick: handleSummarizeClick, // Replace with your actual click handler */
    },
    {
      label: "Ask",
      icon: <BookOpen size={"16px"} />,
      tooltip: "Ask a question based on the document",
      confirmationMessage:
        "This will generate a question based on the document. Do you want to proceed?",
      keyboardShortcut: "Ctrl+Q",
      /*   onClick: handleAskClick, // Replace with your actual click handler */
    },
    {
      label: "Write",
      icon: <Code size={"16px"} />,
      tooltip: "Generate written content based on the document",
      confirmationMessage:
        "This will generate written content based on the document. Do you want to proceed?",
      keyboardShortcut: "Ctrl+W",
      /*     onClick: handleWriteClick, // Replace with your actual click handler */
    },
  ];

  function handleGrammarAnalysisClick(params: string) {}

  if (!show) {
    return null;
  }

  const menuHeight = 380; // Adjust this value based on your menu's height
  const windowHeight = window.innerHeight;

  // Adjust the menu position if it extends beyond the bottom of the window
  const adjustedTop =
    cursorPosition.top + menuHeight > windowHeight
      ? windowHeight - menuHeight - 20
      : cursorPosition.top;

  return (
    <div
      className="menu "
      style={{
        top: `${adjustedTop}px`,
        left: `${cursorPosition.left}px`,
      }}
    >
      {/* Basic Section */}
      <div className="menu-content">
        <div className="menu-section">
          <h3>Insert</h3>
          <div>
            {basicMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onItemClick(item.label as MarkdownSyntaxLabel)}
              >
                <span>{item.icon}</span>
                <div>
                  <p>{item.label}</p>
                  <p>{item.tooltip}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Powered Section */}
        <div className="menu-section">
          <h3>AI Commands</h3>
          <div>
            {aiPoweredMenuItems.map((item) => (
              <button
                disabled={isPro == null}
                key={item.label}
                title={isPro ? "Pro Feature" : "Upgrade to Pro to unlock"}
                onClick={() => onItemClick(item.label as MarkdownSyntaxLabel)}
              >
                <span>{item.icon}</span>
                <div>
                  <p>{item.label}</p>
                  <p>{item.tooltip}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
