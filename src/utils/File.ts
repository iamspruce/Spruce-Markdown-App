const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

export const getDoc = async (): Promise<string> => {
  try {
    const doc = await electronAPI.openFile();
    return doc;
  } catch (error) {
    console.error("Error fetching doc:", error);
    return "";
  }
};
export const updateDoc = async (): Promise<string> => {
  try {
    const doc = await electronAPI.updateFile();
    return doc;
  } catch (error) {
    console.error("Error fetching doc:", error);
    return "";
  }
};
export const docChanged = async ({
  isChanged,
  wordCount,
}: {
  isChanged: boolean;
  wordCount: number;
}): Promise<string> => {
  try {
    const value = {
      isChanged,
      wordCount,
    };
    const doc = await electronAPI.contentChanged(value);
    return doc;
  } catch (error) {
    console.error("Error fetching doc:", error);
    return "";
  }
};

export const saveDocRequest = async (): Promise<void> => {
  const saveFileRequest = electronAPI.onSaveFileRequest();
  return saveFileRequest;
};

export const saveDoc = async (currentDoc: string): Promise<void> => {
  const doc = electronAPI.saveFileRequestValue({ currentDoc });
  return doc;
};
