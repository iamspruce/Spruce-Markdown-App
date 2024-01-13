const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { writeRecentFile } = require("./fileUtils");
const { updateTitle } = require("./updateTitle");

exports.handleSaveFileValue = (_event, content) => {
  const win = BrowserWindow.fromWebContents(_event.sender);
  return handleSaveOperation(win, content);
};

async function handleSaveOperation(win, content) {
  const filePath = win.filePath;
  const options = {
    defaultPath: filePath || path.join(__dirname, "untitled.md"),
    filters: [{ name: "Markdown Files", extensions: ["md"] }],
  };

  if (filePath === path.join(__dirname, "../untitled.md")) {
    const result = await dialog.showSaveDialog(win, options);

    if (!result.canceled && result.filePath) {
      try {
        win.filePath = result.filePath;
        updateTitle(win, false, 0);
        writeRecentFile(result.filePath);
        return true; // Save successful
      } catch (error) {
        console.error("Error writing file:", error.message);
        return false; // Save failed
      }
    } else {
      return false; // Save canceled
    }
  } else {
    // Save without dialog for other files
    try {
      fs.writeFileSync(filePath, content.currentDoc);
      win.setDocumentEdited(false);
      win.setTitle(`Spruce - ${path.basename(win.filePath)}`);
      return true; // Save successful
    } catch (error) {
      console.error("Error writing file:", error.message);
      return false; // Save failed
    }
  }
}
