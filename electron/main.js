const {
  BrowserWindow,
  app,
  Menu,
  ipcMain,
  dialog,
  safeStorage,
} = require("electron");
const path = require("path");
const {
  OpenAIError,
  APIConnectionError,
  AuthenticationError,
} = require("openai");
const Store = require("electron-store");

const store = new Store();

const { createWindow } = require("./utils/createWindows");
const { applicationMenu } = require("./utils/applicationMenu");
const { readRecentFile } = require("./utils/fileUtils");
const { showError } = require("./utils/notificationHandler");
const { handleSaveFileValue } = require("./utils/ipcMainHandlers");
const { OpenAIRequest } = require("./openai/createRequest");
const { openFile } = require("./utils/openFile");
const { updateTitle } = require("./utils/updateTitle");
const {
  activateLicenseKey,
  validateLicenseKey,
} = require("./utils/Licensekey");
const { prompt } = require("./utils/modals/promptModal");

process.env.NODE_ENV = app.isPackaged ? "production" : "development";
const defaultFilePath = path.join(__dirname, "untitled.md");
let filePath = defaultFilePath;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let mainWindow;
app.whenReady().then(() => {
  let isPref = store.get("appPreferences");

  if (isPref && isPref.ifRemDoc) {
    const recentFilePath = readRecentFile();
    app.recentFilePath = recentFilePath;

    filePath = recentFilePath;
  }

  mainWindow = createWindow(filePath);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow(filePath);
    }
  });

  Menu.setApplicationMenu(applicationMenu);
});

ipcMain.handle("openFile", (_event) => {
  let win = BrowserWindow.fromWebContents(_event.sender);

  if (win.filePath) {
    return openFile(win);
  }

  return null;
});

ipcMain.on("save-file-value", (_event, content) => {
  handleSaveFileValue(_event, content);
});

ipcMain.on("contentChanged", (_event, { isChanged, wordCount }) => {
  const win = BrowserWindow.fromWebContents(_event.sender);
  updateTitle(win, isChanged, wordCount);
});

ipcMain.handle("selectFile", async (_event) => {
  const win = BrowserWindow.fromWebContents(_event.sender);
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openFile"],
    filters: [
      {
        name: "Images",
        extensions: ["png", "jpg", "jpeg", "gif", "bmp", "webp"],
      },
    ],
  });
  if (!canceled) {
    return filePaths[0];
  }
});

ipcMain.handle("openai", async (_event, request) => {
  try {
    let win = BrowserWindow.fromWebContents(_event.sender);

    let response = await OpenAIRequest(win, request);

    return response;
  } catch (error) {
    if (error instanceof APIConnectionError) {
      showError(
        "Network Error",
        "There was a problem connecting to the OpenAI API. Please check your internet connection and try again."
      );
    } else if (error instanceof AuthenticationError) {
      // Handle AuthenticationError
      showError(
        "Authentication Error",
        "Invalid OpenAI API key. Please check your API key and try again."
      );
    } else if (error instanceof OpenAIError) {
      // Handle OpenAI specific errors
      console.log(error);
      showError(error.name, `${error.message}`);
    } else {
      // Handle other unexpected errors
      console.log(error);
      showError(
        "Unexpected Error",
        "An unexpected error occurred. Please try again."
      );
    }

    return null; // Return an appropriate response or null if necessary
  }
});

ipcMain.on("save-openai-key", (_event, { key, model }) => {
  let newkey = key;
  if (safeStorage.isEncryptionAvailable() && key !== "") {
    newkey = safeStorage.encryptString(key);
  }
  store.set("openai_key", { key: newkey, model });
});

ipcMain.handle("activateLicense", async (_event, licenseKey) => {
  try {
    let win = BrowserWindow.fromWebContents(_event.sender);
    let response = await activateLicenseKey(win, licenseKey);

    return response;
  } catch (error) {
    console.log(error);
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      showError(
        "Error activating license key",
        "Connection failed. Please check your internet connection."
      );
    } else {
      showError("Error activating license key", error.message);
    }
  }
});

ipcMain.handle("validateLicense", async (_event) => {
  try {
    let response = await validateLicenseKey();
    return response;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      showError(
        "Error activating license key",
        "Connection failed. Please check your internet connection."
      );
    } else {
      showError("Error activating license key", error.message);
    }
  }
});

ipcMain.handle("get-current-window", (_event) => {
  let win = BrowserWindow.fromWebContents(_event.sender);
  return win;
});

ipcMain.on("open-license-modal", async (_event) => {
  let win = BrowserWindow.fromWebContents(_event.sender);
  prompt(win, "Enter License Key", "license");
});

ipcMain.on("open-apiKey-modal", async (_event) => {
  let win = BrowserWindow.fromWebContents(_event.sender);
  prompt(win, "Enter API Key", "apikey");
});

ipcMain.on("close-modal", (_event) => {
  let promptModal = BrowserWindow.fromWebContents(_event.sender);

  promptModal.hide();
});

ipcMain.on("update-parent", (_event, value) => {
  let win = BrowserWindow.getAllWindows();

  win.forEach((openedWindow) => {
    openedWindow.webContents.send("preferencesUpdated", value);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
