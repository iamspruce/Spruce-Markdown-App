const { dialog } = require("electron");

exports.actionRequired = (
  parentWin,
  title,
  message,
  detail,
  actionBtn,
  error
) => {
  return new Promise((resolve, reject) => {
    const apiKeyModal = dialog.showMessageBoxSync(parentWin, {
      type: "question",
      title: title,
      message: message,
      detail: detail,
      buttons: [actionBtn, "Cancel"],
      defaultId: 0,
    });
    if (apiKeyModal === 0) {
      resolve(apiKeyModal);
    } else {
      resolve(apiKeyModal);
    }
  });
};
