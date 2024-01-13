"use client";
import { getAPIKey, saveAPIKey, ApiKey } from "@/utils/Api";
import React from "react";

interface APIContextProps {
  ApiKey: ApiKey;
  updateAPIKey: (key: string, model: string) => void;
}

export const APIContext = React.createContext<APIContextProps | undefined>(
  undefined
);

export const APIProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = React.useState<ApiKey>({
    key: "",
    model: "",
  });

  React.useEffect(() => {
    const fetchKey = async () => {
      const fetchedKey = await getAPIKey();

      setApiKey(fetchedKey);
    };

    fetchKey();
  }, []);

  const updateKey = async (key: string, model: string) => {
    let value = {
      key,
      model,
    };
    setApiKey(value);
    await saveAPIKey(value);
  };

  return (
    <APIContext.Provider
      value={{
        ApiKey: apiKey,
        updateAPIKey: updateKey,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export const useAPIContext = (): APIContextProps => {
  const context = React.useContext(APIContext);
  if (!context) {
    throw new Error("useAPIContext must be used within a APIProvider");
  }
  return context;
};
