const { BrowserWindow, shell } = require("electron");
const path = require("path");
const serve = require("../../serve");

const dir = path.join(__dirname, "../../../app");

const appServe = serve({ directory: dir, scheme: "settings" });

exports.prompt = (parentWin, title, page) => {
  return new Promise((resolve, reject) => {
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
      filePath: "",

      webPreferences: {
        /*  devTools: false, */
        contextIsolation: true,
        nodeIntegration: true,
        preload: path.join(__dirname, "../../preload.js"),
      },
    });

    process.env.NODE_ENV == "development"
      ? prompt.loadURL(`http://localhost:3000/settings/${page}`)
      : appServe(prompt).then(() => {
          const url = `settings://-/settings/${page}.html`;
          prompt.loadURL(url);
        });

    prompt.once("ready-to-show", () => {
      prompt.show();
    });

    prompt.webContents.setWindowOpenHandler((details) => {
      console.log(details);
      shell.openExternal(details.url); // Open URL in user's browser.
      return { action: "deny" }; // Prevent the app from opening the URL.
    });

    prompt.on("hide", () => {
      resolve();
    });
  });
};
