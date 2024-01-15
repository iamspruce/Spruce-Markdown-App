const { contextBridge, ipcRenderer, safeStorage } = require("electron");
const Store = require("electron-store");
const store = new Store();

const api = {
  openFile: () => ipcRenderer.invoke("openFile"),
  contentChanged: (value) => ipcRenderer.send("contentChanged", value),
  onSaveFileRequest: (callback) =>
    ipcRenderer.on("save-file-request", (_event) => callback()),

  saveFileRequestValue: (value) => ipcRenderer.send("save-file-value", value),

  /* remove listeners */
  removeFileSavedListener: (listener) => {
    ipcRenderer.removeListener("save-file-request", listener);
  },
  removeFileSavedValueListener: (listener) => {
    ipcRenderer.removeListener("save-file-value", listener);
  },

  /* select image */
  selectImage: () => ipcRenderer.invoke("selectFile"),

  /* send data to openai*/
  onOpenai: (request) => ipcRenderer.invoke("openai", request),

  getPreferences: () => store.get("appPreferences"),
  setPreferences: (updatedPreferences) =>
    store.set("appPreferences", updatedPreferences),
  onPrefUpdated: (callback) =>
    ipcRenderer.on("preferencesUpdated", (_event, value) => callback(value)),

  onActivateLicensekey: (value) => ipcRenderer.invoke("activateLicense", value),
  onValidateLicensekey: () => ipcRenderer.invoke("validateLicense"),
  onGetLicensekey: () => store.get("licenseKey"),

  onGetAPIKey: () => store.get("openai_key"),
  onSaveAPIKey: (value) => ipcRenderer.send("save-openai-key", value),

  /* settings specific */
  openLicenseModal: () => ipcRenderer.send("open-license-modal"),
  openAPIKeyModal: () => ipcRenderer.send("open-apiKey-modal"),
  closeModal: () => ipcRenderer.send("close-modal"),
  updateParentWindow: (value) => ipcRenderer.send("update-parent", value),
};

contextBridge.exposeInMainWorld("electronAPI", api);
