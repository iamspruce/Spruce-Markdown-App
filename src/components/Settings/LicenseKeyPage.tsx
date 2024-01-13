import { useLicense } from "@/context/LicenseProvider";
import { closeLicenseModal } from "@/utils/licenseKey";
import React, { FormEvent } from "react";

interface SettingsProps {
  onSaveLicenseKey: (licenseKey: string) => void;
}

const SettingsLicenseKey: React.FC<SettingsProps> = ({ onSaveLicenseKey }) => {
  const { licenseKey, updateLicenseKey, activateLicenseKey } = useLicense();
  const key = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    let isValid = await activateLicenseKey(key.current?.value!);

    if (isValid) {
      setLoading(false);
      updateLicenseKey(key.current?.value!);
      closeLicenseModal();
    } else {
      setLoading(false);
      console.log("License is not valid");
    }
  };
  const handleCancel = (event: FormEvent) => {
    event.preventDefault();
    closeLicenseModal();
  };

  return (
    <div className="settings_apiKey">
      <h2>Enter License Key 🔑</h2>
      <form className="settings_apiKey_form" onSubmit={handleSubmit}>
        <label htmlFor="api-key">
          <p>Enter License Key to unlock all Pro features</p>
          <input
            ref={key}
            className="settings_apiKey_form_input"
            type="text"
            id="api-key"
            name="api-key"
            defaultValue={licenseKey!}
            required
          />
          <p>
            Don't have one?{" "}
            <a href="https://sprucemarkdownapp.lemonsqueezy.com/checkout">
              → Buy A license Key
            </a>
          </p>
          <p>
            Lost your License Key?{" "}
            <a href="https://app.lemonsqueezy.com/my-orders/">
              → Recover License Key
            </a>
          </p>
        </label>

        <div className="settings_apiKey_form_actions">
          <button type="submit">
            {loading && (
              <span className="spinner_container">
                <span className="spinner"></span>
              </span>
            )}
            <span>Save</span>
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default SettingsLicenseKey;
