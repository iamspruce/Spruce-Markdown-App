import { LicenseProvider } from "@/context/LicenseProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Neat and Smart markdown app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LicenseProvider>
          <main className="settings">{children}</main>
        </LicenseProvider>
      </body>
    </html>
  );
}
