const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;
export interface ApiKey {
  key: string;
  model: string;
}

export const getAPIKey = async (): Promise<ApiKey> => {
  try {
    const value = await electronAPI.onGetAPIKey();
    if (value == undefined) {
      return {
        key: "",
        model: "",
      };
    } else {
      return value;
    }
  } catch (error) {
    console.error("Error fetching doc:", error);
    return {
      key: "",
      model: "",
    };
  }
};
export const saveAPIKey = async (value: object): Promise<void> => {
  try {
    const savedValue = await electronAPI.onSaveAPIKey(value);
    return savedValue;
  } catch (error) {
    console.error("Error fetching doc:", error);
  }
};

export const closeAPIModal = (): void => {
  electronAPI.closeModal();
};
