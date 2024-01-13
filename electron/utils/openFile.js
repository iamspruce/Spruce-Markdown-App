const path = require("path");
const fs = require("fs");
const { updateTitle } = require("./updateTitle");

exports.openFile = (win) => {
  let fileToOpen;
  if (fs.existsSync(win.filePath)) {
    fileToOpen = win.filePath;
  } else {
    fileToOpen = path.join(__dirname, "../untitled.md");
  }

  const content = fs.readFileSync(fileToOpen, "utf-8");
  let totalWords = content.split(" ").filter((a) => a.trim().length > 0).length;

  updateTitle(win, false, totalWords);

  return content;
};
