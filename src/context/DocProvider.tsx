"use client";
import useSaveFileRequest from "@/hooks/useSaveFileRequest";
import { docChanged, getDoc, saveDoc } from "@/utils/File";
import React from "react";

interface DocContextProps {
  initialDoc: string;
  updateDoc: (license: string) => void;
  currentDoc: string;
}

export const DocContext = React.createContext<DocContextProps | undefined>(
  undefined
);

export const DocProvider = ({ children }: { children: React.ReactNode }) => {
  const [doc, setDoc] = React.useState("");
  const currentDoc = React.useRef("");

  useSaveFileRequest(() => {
    saveDoc(currentDoc.current);
    setDoc(currentDoc.current);
  });

  React.useEffect(() => {
    const fetchDoc = async () => {
      const doc = await getDoc();
      setDoc(doc);
    };

    fetchDoc();
  }, []);

  const updateDoc = async (newDoc: string) => {
    currentDoc.current = newDoc;

    const wordRegex = /\b\w+\b/g;
    const words = newDoc.match(wordRegex) || [];
    const totalWords = words.length;

    await docChanged({
      isChanged: newDoc == doc ? false : true,
      wordCount: totalWords,
    });
  };

  return (
    <DocContext.Provider
      value={{
        initialDoc: doc,
        updateDoc,
        currentDoc: currentDoc.current,
      }}
    >
      {children}
    </DocContext.Provider>
  );
};

export const useDoc = (): DocContextProps => {
  const context = React.useContext(DocContext);
  if (!context) {
    throw new Error("useDoc must be used within a DocProvider");
  }
  return context;
};
