import { useEffect } from "react";
const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

const useSaveFileRequest = (callback: () => void) => {
  useEffect(() => {
    const handleSaveFileRequest = () => {
      callback();
    };

    electronAPI.onSaveFileRequest(handleSaveFileRequest);

    return () => {
      electronAPI.removeFileSavedListener(handleSaveFileRequest);
    };
  }, []);
};

export default useSaveFileRequest;
