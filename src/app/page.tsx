"use client";
import Editor from "@/components/Editor";
import { usePreferences } from "@/context/AppPreferenceProvider";
import { DocProvider } from "@/context/DocProvider";
import React from "react";

export default function Home() {
  const { preferences } = usePreferences();

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", preferences?.theme!);
    document.documentElement.style.fontSize = `${preferences?.fontSize!}px`;
    document.documentElement.style.fontFamily = "initial";
    document.documentElement.style.fontFamily = `${preferences?.fontStyle!}`;
  }, [preferences]);

  return (
    <html lang="en">
      <body>
        <main>
          <div className={`container`} id="container">
            <div className="panels">
              <DocProvider>
                <Editor />
              </DocProvider>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
