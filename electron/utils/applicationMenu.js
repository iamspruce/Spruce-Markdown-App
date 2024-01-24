const { app, BrowserWindow, Menu, dialog } = require("electron");
const { createWindow } = require("./createWindows");
const path = require("path");
const serve = require("../serve");

const dir = path.join(__dirname, "../../out");
const appServe = serve({ directory: dir, scheme: "setting" });

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "New File",
        accelerator: "CommandOrControl+N",
        click() {
          createWindow();
        },
      },
      {
        label: "Open File",
        accelerator: "CommandOrControl+O",
        click: async (item, focusedWindow) => {
          try {
            // Show open file dialog
            const { filePaths } = await dialog.showOpenDialog(focusedWindow, {
              properties: ["openFile"],
              filters: [{ name: "Markdown Files", extensions: ["md"] }],
            });

            if (filePaths && filePaths.length > 0) {
              const filePath = filePaths[0];

              // Trigger the openFile IPC handler
              createWindow(filePath);
            }
          } catch (error) {
            console.error("Error:", error.message);
          }
        },
      },
      {
        label: "Save File",
        accelerator: "CommandOrControl+S",
        click: () => {
          // Trigger the save logic in your renderer process
          const activeWindow = BrowserWindow.getFocusedWindow();
          if (activeWindow) {
            activeWindow.webContents.send("save-file-request");
          }
        },
      },
      {
        label: "Export HTML",
        accelerator: "Shift+CommandOrControl+S",
        click(item, focusedWindow) {
          focusedWindow.webContents.send("save-html");
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CommandOrControl+Z",
        role: "undo",
      },
      {
        label: "Redo",
        accelerator: "Shift+CommandOrControl+Z",
        role: "redo",
      },
      { type: "separator" },
      {
        label: "Cut",
        accelerator: "CommandOrControl+X",
        role: "cut",
      },
      {
        label: "Copy",
        accelerator: "CommandOrControl+C",
        role: "copy",
      },
      {
        label: "Paste",
        accelerator: "CommandOrControl+V",
        role: "paste",
      },
      {
        label: "Select All",
        accelerator: "CommandOrControl+A",
        role: "selectall",
      },
    ],
  },
  {
    label: "Window",
    submenu: [
      {
        label: "Minimize",
        accelerator: "CommandOrControl+M",
        role: "minimize",
      },
      {
        label: "Close",
        accelerator: "CommandOrControl+W",
        role: "close",
      },
    ],
  },
  {
    label: "Help",
    role: "help",
    submenu: [
      {
        label: "Visit Website",
        click() {
          /* To be implemented */
        },
      },
      {
        label: "Toggle Developer Tools",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: `About ${name}`,
        role: "about",
      },
      { type: "separator" },
      {
        label: "Services",
        role: "services",
        submenu: [],
      },
      {
        label: "Settings",
        role: "Settings",
        accelerator: "Command+,",
        click: (item, focusedWindow) => {
          const settingsWindow = new BrowserWindow({
            width: 520,
            parent: focusedWindow,
            show: false,
            useContentSize: true,
            title: "Settings",
            alwaysOnTop: true,
            backgroundColor: "rgb(51, 51, 51)",
            webPreferences: {
              /* devTools: false, */
              contextIsolation: true,
              nodeIntegration: true,
              preload: path.join(__dirname, "../preload.js"),
            },
          });
          process.env.NODE_ENV !== "development"
            ? settingsWindow.loadURL("http://localhost:3000/settings")
            : appServe(settingsWindow).then(() => {
                const url = `setting://-/settings.html`;
                settingsWindow.loadURL(url);
              });
          settingsWindow.once("ready-to-show", () => {
            settingsWindow.show();
          });
        },
      },
      { type: "separator" },
      {
        label: `Hide ${name}`,
        accelerator: "Command+H",
        role: "hide",
      },
      {
        label: "Hide Others",
        accelerator: "Command+Alt+H",
        role: "hideothers",
      },
      {
        label: "Show All",
        role: "unhide",
      },
      { type: "separator" },
      {
        label: `Quit ${name}`,
        accelerator: "Command+Q",
        click() {
          app.quit();
        },
      },
    ],
  });
}

const windowMenu = template.find((item) => item.label === "Window");
windowMenu.role = "window";
windowMenu.submenu.push(
  { type: "separator" },
  {
    label: "Bring All to Front",
    role: "front",
  }
);
const applicationMenu = Menu.buildFromTemplate(template);

exports.applicationMenu = applicationMenu;
