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
  HTTPError,
  RequestError,
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
let filePath;

app.whenReady().then(() => {
  const recentFilePath = readRecentFile();
  const defaultFilePath = path.join(__dirname, "untitled.md");
  filePath = recentFilePath || defaultFilePath;
  app.recentFilePath = filePath;
  createWindow(filePath);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(filePath);
    }
  });

  Menu.setApplicationMenu(applicationMenu);
});

ipcMain.handle("openFile", (_event) => {
  let win = BrowserWindow.fromWebContents(_event.sender);

  return openFile(win);
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
      showError(error.name, `${error.message}`);
    } else {
      // Handle other unexpected errors
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
  let promptModal = prompt(win, "Enter License Key", "license");

  ipcMain.on("close-modal", (_event) => {
    promptModal.hide();
  });
});
ipcMain.on("open-apiKey-modal", async (_event) => {
  let win = BrowserWindow.fromWebContents(_event.sender);
  let promptModal = prompt(win, "Enter API Key", "apikey");

  ipcMain.on("close-modal", (_event) => {
    promptModal.hide();
  });
});

ipcMain.on("update-parent", (_event, value) => {
  let win = BrowserWindow.fromWebContents(_event.sender);
  let parentWin = win.getParentWindow();

  parentWin.webContents.send("preferencesUpdated", value);
});

ipcMain.on("save-api-key", async (_event, response) => {
  let promptModal = BrowserWindow.fromWebContents(_event.sender);
  try {
    let apiKey = response.apiKey;
    if (safeStorage.isEncryptionAvailable() && apiKey !== "") {
      let secure_key = safeStorage.encryptString(apiKey);
      store.set("openai_key", secure_key);
      store.set("openai_model", response.model);
      promptModal.hide();
      showSuccess(
        win,
        "API Key Saved",
        "Your API key has been saved successfully. Now retry your request"
      );
    }
  } catch (error) {
    showError("Error saving API Key", error.message);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
