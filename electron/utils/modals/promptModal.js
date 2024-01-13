const { BrowserWindow } = require("electron");
const path = require("path");

exports.prompt = (parentWin, title, page) => {
  let prompt = new BrowserWindow({
    height: 340,
    width: 480,
    parent: parentWin,
    modal: true,
    show: false,
    useContentSize: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    skipTaskbar: true,
    title: title,
    frame: false,
    alwaysOnTop: true,
    backgroundColor: "#fff",
    webPreferences: {
      /*  devTools: false, */
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "../../preload.js"),
    },
  });
  prompt.loadURL(`http://localhost:3000/settings/${page}`);

  prompt.once("ready-to-show", () => {
    prompt.show();
  });

  return prompt;
};
