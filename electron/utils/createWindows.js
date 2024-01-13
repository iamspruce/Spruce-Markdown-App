const { BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const serve = require("electron-serve");
const { handleSaveFileValue } = require("./ipcMainHandlers");

// Maintain a list of open windows
const openWindows = [];

const page = path.join(__dirname, "../../out");
const appServe = serve({ directory: page });

exports.createWindow = (filePath) => {
  let x, y;
  const currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 20;
    y = currentWindowY + 20;
  }

  // Check if the file is already open
  const existingWindow = openWindows.find((win) => win.filePath === filePath);

  if (existingWindow) {
    // If the file is already open, focus on the existing window
    existingWindow.window.focus();
    return;
  }

  let win = new BrowserWindow({
    width: 1024,
    height: 650,
    show: false,
    x,
    y,
    webPreferences: {
      webSecurity: false,
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "../preload.js"),
    },
  });

  win.filePath = filePath || path.join(__dirname, "../untitled.md");

  // Add the new window to the list of open windows
  openWindows.push({
    window: win,
    filePath: filePath,
  });

  /* load the window */
  process.env.NODE_ENV === "development"
    ? win.loadURL("http://localhost:3000")
    : appServe(win).then(() => {
        win.loadURL("app://-");
      });

  win.on("ready-to-show", (_event) => {
    win.show();
  });

  win.on("closed", () => {
    openWindows.splice(
      openWindows.findIndex((winItem) => winItem.window === win),
      1
    );
    win = null;
  });

  win.on("close", async (event) => {
    if (win.isDocumentEdited()) {
      event.preventDefault();
      const response = await dialog.showMessageBox(win, {
        type: "question",
        buttons: ["Save", "Don't Save", "Cancel"],
        defaultId: 0,
        message: "Do you want to save your changes?",
      });

      if (response.response === 0) {
        // Save changes
        // Add your save logic here
        win.webContents.send("save-file-request");

        ipcMain.on("save-file-value", async (_event, content) => {
          let saveFile = await handleSaveFileValue(_event, content);

          if (saveFile) {
            win.setDocumentEdited(false);
            win.close();
          }
        });
      } else if (response.response === 1) {
        win.setDocumentEdited(false);
        win.close();
      } else if (response.response === 2) {
        // Cancel
        event.preventDefault(); // Prevent the window from closing immediately
      }
    } else {
      return true;
    }
  });

  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
  }

  return win;
};
