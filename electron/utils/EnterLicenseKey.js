const { dialog, BrowserWindow, ipcMain, safeStorage } = require("electron");
const path = require("path");
const Store = require("electron-store");
const { showSuccess } = require("./notificationHandler");
const { prompt } = require("./modals/promptModal");

const store = new Store();

exports.EnterLicenseKey = (win) => {
  return new Promise((resolve, reject) => {
    const LicenseModal = dialog.showMessageBoxSync(win, {
      type: "question",
      title: "Enter Your License Key",
      message: "You need a License key to Activate this feature",
      detail: "Your API key is stored locally and never sent anywhere else",
      buttons: ["Enter your License Key", "Cancel"],
      defaultId: 0,
    });
    if (LicenseModal === 0) {
      let promptWin = prompt(win, "Enter License Key", "license");
      resolve(promptWin);
    } else {
      reject(new Error("You must Active Pro Plan to use this feature"));
    }
  });
};
