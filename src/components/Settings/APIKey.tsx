import { useAPIContext } from "@/context/APIProvider";
import { closeAPIModal } from "@/utils/Api";
import React, { FormEvent, useRef } from "react";

const Settings = () => {
  const key = useRef<HTMLInputElement>(null);
  const model = useRef<HTMLSelectElement>(null);

  const { ApiKey, updateAPIKey } = useAPIContext();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateAPIKey(key.current?.value!, model.current?.value!);
    closeAPIModal();
  };
  const handleCancel = (event: FormEvent) => {
    event.preventDefault();
    closeAPIModal();
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
            ref={key}
            className="settings_apiKey_form_input"
            type="password"
            id="api-key"
            name="api-key"
            defaultValue={ApiKey.key}
            required
          />
        </label>
        <label htmlFor="api-model">
          <p>Select a model to use (default: gtp-3.5-turbo-1106)</p>
          <select
            ref={model}
            name="api-model"
            id="api-model"
            defaultValue={ApiKey.model}
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
