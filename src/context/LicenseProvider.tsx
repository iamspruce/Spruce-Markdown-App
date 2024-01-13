"use client";
import {
  getLicense,
  ActivateLicense,
  ValidateLicense,
} from "@/utils/licenseKey";
import React from "react";

interface LicenseContextProps {
  licenseKey: string | null;
  updateLicenseKey: (license: string) => void;
  activateLicenseKey: (license: string) => Promise<boolean>;
  validateLicenseKey: (license: string) => void;
}

export const LicenseContext = React.createContext<
  LicenseContextProps | undefined
>(undefined);

export const LicenseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [licenseKey, setLicenseKey] = React.useState("");

  React.useEffect(() => {
    const fetchKey = async () => {
      const fetchedKey = await getLicense();

      setLicenseKey(fetchedKey);
    };

    fetchKey();
  }, []);

  const updateLicenseKey = (key: string) => {
    setLicenseKey(key);
  };

  const activateLicenseKey = async (key: string): Promise<boolean> => {
    const status = await ActivateLicense(key);

    return status;
  };

  const validateLicenseKey = async () => {
    const status = await ValidateLicense();

    return status;
  };

  return (
    <LicenseContext.Provider
      value={{
        licenseKey,
        updateLicenseKey,
        activateLicenseKey,
        validateLicenseKey,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};

export const useLicense = (): LicenseContextProps => {
  const context = React.useContext(LicenseContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
