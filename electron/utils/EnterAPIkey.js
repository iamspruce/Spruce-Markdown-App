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

      ipcMain.on("save-api-key", async (_event, response) => {
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
            resolve(); // Resolve the promise indicating successful API key entry
          } else {
            promptModal.hide();
            reject(
              new Error(
                "Could not encrypt the api key, please check if encryption is available on your computer"
              )
            );
          }
        } catch (error) {
          reject(error);
        }
      });
    } else {
      reject(
        new Error("You must provide an OpenAi API key to use this feature")
      );
    }
  });
};
