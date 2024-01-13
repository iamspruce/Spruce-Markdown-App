const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

export const getLicense = async (): Promise<string> => {
  try {
    const { key } = await electronAPI.onGetLicensekey();
    if (key == undefined) {
      return "";
    } else {
      return key;
    }
  } catch (error) {
    console.error("Error fetching doc:", error);
    return "";
  }
};

export const ActivateLicense = async (Licensekey: string): Promise<boolean> => {
  const key = await electronAPI.onActivateLicensekey(Licensekey);
  return key;
};

export const ValidateLicense = async (): Promise<string> => {
  const status = await electronAPI.onValidateLicensekey();
  return status;
};

export const closeLicenseModal = (): void => {
  electronAPI.closeModal();
};
