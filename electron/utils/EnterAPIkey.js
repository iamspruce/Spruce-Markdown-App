const { dialog, BrowserWindow, ipcMain, safeStorage } = require("electron");
const path = require("path");
const Store = require("electron-store");
const { showSuccess } = require("./notificationHandler");
const { prompt } = require("./modals/promptModal");

const store = new Store();

exports.EnterApiKey = (win) => {
  return new Promise((resolve, reject) => {
    const apiKeyModal = dialog.showMessageBoxSync(win, {
      type: "question",
      title: "Enter Your OpenAI API Key",
      message: "You need an OpenAI API key to use this feature",
      detail: "Your API key is stored locally and never sent anywhere else",
      buttons: ["Enter your Api Key", "Cancel"],
      defaultId: 0,
    });
    if (apiKeyModal === 0) {
      let promptModal = prompt(win, "Enter API key", "apikey");
    } else {
      reject(
        new Error("You must provide an OpenAi API key to use this feature")
      );
    }
  });
};
