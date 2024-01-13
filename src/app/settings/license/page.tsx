"use client";
import SettingsLicenseKey from "@/components/Settings/LicenseKeyPage";

const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

const Home: React.FC = () => {
  const handleSaveApiKey = async (licenseKey: string) => {
    await electronAPI.onSaveKey(licenseKey);
  };

  return (
    <div>
      <main>
        <SettingsLicenseKey onSaveLicenseKey={handleSaveApiKey} />
      </main>
    </div>
  );
};

export default Home;
