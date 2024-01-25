const { app } = require("electron");
const { writeRecentFile } = require("./fileUtils");
const path = require("path");
const Store = require("electron-store");

const store = new Store();

exports.updateTitle = (win, isChanged, wordCount) => {
  const fileName = path.basename(win.filePath);

  let pref = store.get("appPreferences");
  let ifWordCount = false;

  if (pref && pref.ifWordCount) {
    ifWordCount = true;
  }
  const totalWords = ifWordCount ? `(${wordCount} words)` : "";

  if (isChanged) {
    win.setDocumentEdited(true);
    const currentTitle = win.getTitle();
    let prevWords = currentTitle.replace(/\(([^)]+)\)/g, `${totalWords}`);
    const editedTitle = currentTitle.includes("- edited")
      ? `${prevWords}`
      : `${fileName} - edited ${totalWords}`;

    win.setTitle(editedTitle);
  } else {
    win.setDocumentEdited(false);

    win.setTitle(`${fileName} ${totalWords}`);
    win.setRepresentedFilename(win.filePath);
    app.addRecentDocument(win.filePath);
    writeRecentFile(win.filePath);
  }
};
