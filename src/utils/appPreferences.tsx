const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;
export interface Preferences {
  theme: string;
  fontStyle: string;
  fontSize: number;
  ifStream: boolean;
  ifRemDoc: boolean;
  ifSpellCheck: boolean;
  ifCodeHighlight: boolean;
  ifWordCount: boolean;
}

export const getPreferences = async (): Promise<Preferences | null> => {
  try {
    const preferences = await electronAPI.getPreferences();
    return preferences;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return null;
  }
};

export const setPreferences = async (
  updatedPreferences: Partial<Preferences>
): Promise<Preferences | null> => {
  try {
    const preferences: Preferences = await electronAPI.setPreferences(
      updatedPreferences
    );
    return preferences;
  } catch (error) {
    console.error("Error updating preferences:", error);
    return null;
  }
};

export const prefUpdated = async (
  callback: ({ name, value }: { name: string; value: string | number }) => void
): Promise<void> => {
  await electronAPI.onPrefUpdated(callback);
};
