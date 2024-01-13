"use client";
import Settings from "@/components/Settings/APIKey";
const electronAPI =
  typeof window !== "undefined" && (window as any).electronAPI;

const Home: React.FC = () => {
  const handleSaveApiKey = async (apiKey: string, model: string) => {
    electronAPI.onSaveKey({ apiKey: apiKey, model: model });
  };

  return (
    <div>
      <main>
        {/* Render the Settings component */}
        <Settings onSaveApiKey={handleSaveApiKey} />
      </main>
    </div>
  );
};

export default Home;
