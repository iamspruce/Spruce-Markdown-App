const { showSuccess, showError } = require("./notificationHandler");

const Store = require("electron-store");

const store = new Store();

exports.activateLicenseKey = async (win, licenseKey) => {
  const apiUrl = "https://api.lemonsqueezy.com/v1/licenses/activate";
  let instanceName = "sprucemarkdownappinstance";
  let store_id = 63429;
  let product_id = 163491;

  const data = {
    license_key: licenseKey,
    instance_name: instanceName,
  };
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  };

  if (store.get("licenseKey").key == licenseKey) {
    showSuccess(
      win,
      "License Key Already Activated",
      "Your License is already activated, enjoy the pro features!"
    );
    return store.get("licenseKey").activated;
  }

  const response = await fetch(apiUrl, options);
  const result = await response.json();

  if (
    result.activated &&
    result.meta.product_id == product_id &&
    result.meta.store_id == store_id
  ) {
    showSuccess(
      win,
      "License Key Activated",
      "License key activated successfully!"
    );
    store.set("licenseKey", {
      key: result.license_key.key,
      instance: result.instance.id,
      status: result.license_key.status,
      activated: result.activated,
    });

    return result.activated;
  } else {
    showError("Failed to activate license key", result.error);

    return result.activated;
  }
};

exports.validateLicenseKey = async () => {
  const apiUrl = "https://api.lemonsqueezy.com/v1/licenses/validate";

  let licenseKey = store.get("licenseKey").key;
  const data = {
    license_key: licenseKey,
  };

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  };

  try {
    const response = await fetch(apiUrl, options);
    const result = await response.json();

    return result.valid;
  } catch (error) {
    console.error("Error validating license key:", error);
    return false;
  }
};
