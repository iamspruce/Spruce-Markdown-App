const { dialog } = require("electron");

exports.showSuccess = (win, title, message) => {
  dialog.showMessageBoxSync(win, {
    type: "info",
    title: title || "Success",
    message: title || "Success",
    detail: message || "Operation completed successfully.",
  });
};

exports.showError = (title, message) => {
  dialog.showErrorBox(title || "Error", message || "An error occurred.");
};
