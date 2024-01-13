import type { Metadata } from "next";
import "../styles/main.scss";
import { DocProvider } from "@/context/DocProvider";
import {
  PreferencesProvider,
  usePreferences,
} from "@/context/AppPreferenceProvider";

export const metadata: Metadata = {
  description: "Neat and Smart markdown app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PreferencesProvider>{children}</PreferencesProvider>;
}
