const { app } = require("electron");
const { writeRecentFile } = require("./fileUtils");
const path = require("path");
const Store = require("electron-store");

const store = new Store();

exports.updateTitle = (win, isChanged, wordCount) => {
  const ifWordCount = store.get("appPreferences").ifWordCount;

  const totalWords = ifWordCount ? `${wordCount} words` : "";

  if (isChanged) {
    win.setDocumentEdited(true);
    const currentTitle = win.getTitle();
    const editedTitle = currentTitle.includes("(edited)")
      ? `${currentTitle}`
      : `${currentTitle} (edited)`;

    win.setTitle(editedTitle);
  } else {
    win.setDocumentEdited(false);

    const fileName = path.basename(win.filePath);
    win.setTitle(`Spruce - ${fileName}`);
    win.setRepresentedFilename(win.filePath);
    app.addRecentDocument(win.filePath);
    writeRecentFile(win.filePath);
  }
};
