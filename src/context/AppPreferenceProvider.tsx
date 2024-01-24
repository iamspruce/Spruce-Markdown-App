"use client";
import {
  getPreferences,
  Preferences,
  prefUpdated,
  setPreferences,
} from "@/utils/appPreferences";
import React from "react";

interface PreferencesContextProps {
  preferences: Preferences | null;
  updatePreferences: (name: string, value: string | number | boolean) => void;
}
const defaults = {
  theme: "writer",
  fontStyle: "FiraCode",
  fontSize: 14,
  ifStream: true,
  ifRemDoc: true,
  ifSpellCheck: false,
  ifCodeHighlight: false,
  ifWordCount: false,
};
export const PreferencesContext = React.createContext<
  PreferencesContextProps | undefined
>(undefined);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferencesState] = React.useState<Preferences | null>(
    defaults
  );

  React.useEffect(() => {
    const fetchPref = async () => {
      const fetchedPref = await getPreferences();

      if (fetchedPref !== null) {
        setPreferencesState(fetchedPref);
      } else {
        setPreferencesState(defaults);
      }
    };

    fetchPref();
  }, []);

  const updatePreferences = (
    name: string,
    value: string | number | boolean
  ) => {
    setPreferencesState((prevState) =>
      prevState
        ? {
            ...prevState,
            [name]: value,
          }
        : null
    );
  };

  React.useEffect(() => {
    const updatePref = async () => {
      await setPreferences(preferences!);
    };

    updatePref();
  }, [preferences]);

  const handlePref = ({
    name,
    value,
  }: {
    name: string;
    value: string | number;
  }) => {
    updatePreferences(name, value);
  };

  React.useEffect(() => {
    prefUpdated(handlePref);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{ preferences, updatePreferences: updatePreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = (): PreferencesContextProps => {
  const context = React.useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
