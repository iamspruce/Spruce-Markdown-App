"use client";
import Editor from "@/components/Editor";
import { APIProvider } from "@/context/APIProvider";
import { usePreferences } from "@/context/AppPreferenceProvider";
import { DocProvider } from "@/context/DocProvider";
import { LicenseProvider } from "@/context/LicenseProvider";
const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

import React from "react";

export default function Home() {
  const { preferences, updatePreferences } = usePreferences();

  React.useEffect(() => {
    const handleSaveFileRequest = ({
      name,
      value,
    }: {
      name: string;
      value: string | number;
    }) => {
      updatePreferences(name, value);
    };

    electronAPI.onPrefUpdated(handleSaveFileRequest);

    document.documentElement.setAttribute("data-theme", preferences?.theme!);
    document.documentElement.style.fontSize = `${preferences?.fontSize!}px`;
    document.documentElement.style.fontFamily = `${preferences?.fontStyle!}`;
  }, [preferences]);

  return (
    <html lang="en">
      <body>
        <main>
          <div className={`container`} id="container">
            <div className="panels">
              <DocProvider>
                <APIProvider>
                  <LicenseProvider>
                    <Editor />
                  </LicenseProvider>
                </APIProvider>
              </DocProvider>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
