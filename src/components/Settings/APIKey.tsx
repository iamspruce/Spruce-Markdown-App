import { useLocalStorage } from "@/hooks/useLocalStorage";
import React, { useState, FormEvent } from "react";

interface SettingsProps {
  onSaveApiKey: (apiKey: string, model: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSaveApiKey }) => {
  const [apiKey, setApiKey] = useLocalStorage("", "apiKey");
  const [model, setModel] = useLocalStorage("", "model");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSaveApiKey(apiKey, model);
  };
  const handleCancel = (event: FormEvent) => {
    event.preventDefault();
    onSaveApiKey("", "");
  };

  return (
    <div className="settings_apiKey">
      <h2>Enter API Key</h2>
      <form className="settings_apiKey_form" onSubmit={handleSubmit}>
        <label htmlFor="api-key">
          <p>
            OpenAI API Key: (
            <a href="http://" target="_blank" rel="noopener noreferrer">
              Get API Key here
            </a>
            )
          </p>
          <input
            className="settings_apiKey_form_input"
            type="password"
            id="api-key"
            name="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </label>
        <label htmlFor="api-model">
          <p>Select a model to use (default: gtp-3.5-turbo-1106)</p>
          <select
            onChange={(e) => setModel(e.target.value)}
            name="api-model"
            id="api-model"
            className="settings_apiKey_form_select"
          >
            <optgroup label="GPT-4 and GPT-4 Turbo">
              <option value="gpt-4-1106-preview">gpt-4-1106-preview</option>
              <option value="gpt-4-vision-preview">gpt-4-vision-preview</option>
              <option value="gpt-4">gpt-4</option>
              <option value="gpt-4-32k">gpt-4-32k</option>
            </optgroup>
            <optgroup label="GTP-3.5">
              <option value="gpt-3.5-turbo-0613">gpt-3.5-turbo-0613</option>
              <option value="gpt-3.5-turbo-0301">gpt-3.5-turbo-0301</option>
              <option value="gpt-3.5-turbo-16k">gtp-3.5-turbo-16k</option>
              <option value="gpt-3.5-turbo-instruct">
                gtp-3.5-turbo-instruct
              </option>
            </optgroup>
          </select>
        </label>
        <div className="settings_apiKey_form_actions">
          <button type="submit">Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
