"use client";
import React from "react";

import Editor from "@/components/Editor";
import { APIProvider } from "@/context/APIProvider";
import { usePreferences } from "@/context/AppPreferenceProvider";
import { DocProvider } from "@/context/DocProvider";
import { LicenseProvider } from "@/context/LicenseProvider";

export default function Home() {
  const { preferences } = usePreferences();

  React.useEffect(() => {
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
